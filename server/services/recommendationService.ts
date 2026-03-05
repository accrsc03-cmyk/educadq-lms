/**
 * Course Recommendation Service
 * Provides personalized course recommendations based on student history
 */

import { getDb } from "../db";
import { eq, and, not, inArray } from "drizzle-orm";
import { courses, enrollments, progress } from "../../drizzle/schema";

interface RecommendedCourse {
  id: number;
  title: string;
  description: string;
  hourlyLoad: number;
  value: string;
  coverImage: string;
  reason: string;
  score: number;
}

/**
 * Get recommended courses for a student
 */
export async function getRecommendedCourses(
  studentId: number,
  limit: number = 5
): Promise<RecommendedCourse[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const enrolledCourses = await db
      .select({ courseId: enrollments.courseId })
      .from(enrollments)
      .where(eq(enrollments.studentId, studentId));

    const enrolledCourseIds = enrolledCourses.map((e) => e.courseId);

    const allCourses = await db
      .select()
      .from(courses)
      .where(
        enrolledCourseIds.length > 0
          ? not(inArray(courses.id, enrolledCourseIds))
          : undefined
      );

    const scoredCourses = await Promise.all(
      allCourses.map(async (course) => {
        let score = 50;
        let reasons: string[] = [];

        const enrollmentCount = await db
          .select({ count: enrollments.id })
          .from(enrollments)
          .where(eq(enrollments.courseId, course.id));

        if (enrollmentCount.length > 10) {
          score += 20;
          reasons.push("Popular entre alunos");
        }

        const completedCount = await db
          .select({ count: progress.id })
          .from(progress)
          .where(eq(progress.completed, true));

        if (completedCount.length > 5) {
          score += 15;
          reasons.push("Alta taxa de conclusão");
        }

        const courseAge = Date.now() - (course.createdAt?.getTime() || 0);
        if (courseAge < 30 * 24 * 60 * 60 * 1000) {
          score += 10;
          reasons.push("Curso novo");
        }

        const courseValue = parseFloat(course.price.toString());
        if (courseValue < 100) {
          score += 5;
          reasons.push("Preço acessível");
        }

        return {
          id: course.id,
          title: course.title,
          description: course.description || "",
          hourlyLoad: course.loadHours,
          value: course.price.toString(),
          coverImage: course.coverUrl || "",
          reason: reasons.join(", ") || "Recomendado para você",
          score: Math.min(100, Math.max(0, score)),
        };
      })
    );

    return scoredCourses.sort((a, b) => b.score - a.score).slice(0, limit);
  } catch (error) {
    console.error("[Recommendation] Error getting recommendations:", error);
    return [];
  }
}

/**
 * Get trending courses
 */
export async function getTrendingCourses(limit: number = 5): Promise<RecommendedCourse[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const allCourses = await db.select().from(courses);

    const scoredCourses = await Promise.all(
      allCourses.map(async (course) => {
        let score = 0;

        const recentEnrollments = await db
          .select({ count: enrollments.id })
          .from(enrollments)
          .where(eq(enrollments.courseId, course.id));

        score += recentEnrollments.length * 10;

        const completions = await db
          .select({ count: progress.id })
          .from(progress)
          .where(eq(progress.completed, true));

        score += completions.length * 5;

        return {
          id: course.id,
          title: course.title,
          description: course.description || "",
          hourlyLoad: course.loadHours,
          value: course.price.toString(),
          coverImage: course.coverUrl || "",
          reason: "Tendência do momento",
          score: Math.min(100, Math.max(0, score)),
        };
      })
    );

    return scoredCourses.sort((a, b) => b.score - a.score).slice(0, limit);
  } catch (error) {
    console.error("[Trending] Error getting trending courses:", error);
    return [];
  }
}

/**
 * Get similar courses based on a given course
 */
export async function getSimilarCourses(
  courseId: number,
  limit: number = 5
): Promise<RecommendedCourse[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const baseCourse = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1);

    if (!baseCourse.length) return [];

    const allCourses = await db
      .select()
      .from(courses)
      .where(not(eq(courses.id, courseId)));

    const scoredCourses = allCourses.map((course) => {
      let score = 50;

      const basePriceNum = parseFloat(baseCourse[0].price.toString());
      const coursePriceNum = parseFloat(course.price.toString());
      const priceDiff = Math.abs(basePriceNum - coursePriceNum);

      if (priceDiff < 50) {
        score += 20;
      } else if (priceDiff < 100) {
        score += 10;
      }

      const hourDiff = Math.abs(baseCourse[0].loadHours - course.loadHours);
      if (hourDiff < 10) {
        score += 15;
      } else if (hourDiff < 20) {
        score += 8;
      }

      return {
        id: course.id,
        title: course.title,
        description: course.description || "",
        hourlyLoad: course.loadHours,
        value: course.price.toString(),
        coverImage: course.coverUrl || "",
        reason: "Similar a este curso",
        score: Math.min(100, Math.max(0, score)),
      };
    });

    return scoredCourses.sort((a, b) => b.score - a.score).slice(0, limit);
  } catch (error) {
    console.error("[Similar] Error getting similar courses:", error);
    return [];
  }
}
