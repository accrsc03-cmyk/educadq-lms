-- Adicionar coluna de tipo de curso
ALTER TABLE courses ADD COLUMN courseType ENUM('free', 'mec') DEFAULT 'free' NOT NULL;

-- Adicionar índice para tipo de curso
CREATE INDEX courseType_idx ON courses(courseType);

-- Tabela para portal de conteúdo
CREATE TABLE IF NOT EXISTS content_articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content LONGTEXT NOT NULL,
  excerpt VARCHAR(500),
  coverUrl VARCHAR(500),
  authorId INT NOT NULL,
  category VARCHAR(100),
  isPublished BOOLEAN DEFAULT false,
  views INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (authorId) REFERENCES users(id),
  INDEX (slug),
  INDEX (category),
  INDEX (isPublished)
);

-- Tabela para comentários em aulas
CREATE TABLE IF NOT EXISTS lesson_comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lessonId INT NOT NULL,
  studentId INT NOT NULL,
  content TEXT NOT NULL,
  parentCommentId INT,
  isApproved BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (lessonId) REFERENCES lessons(id),
  FOREIGN KEY (studentId) REFERENCES users(id),
  FOREIGN KEY (parentCommentId) REFERENCES lesson_comments(id),
  INDEX (lessonId),
  INDEX (studentId),
  INDEX (createdAt)
);

-- Tabela para analytics
CREATE TABLE IF NOT EXISTS course_analytics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  courseId INT NOT NULL,
  totalEnrollments INT DEFAULT 0,
  completedEnrollments INT DEFAULT 0,
  averageGrade DECIMAL(5, 2),
  totalRevenue DECIMAL(12, 2) DEFAULT 0,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (courseId) REFERENCES courses(id),
  UNIQUE KEY (courseId)
);

-- Tabela para transações MercadoPago
CREATE TABLE IF NOT EXISTS mercadopago_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  enrollmentId INT NOT NULL,
  mpPaymentId VARCHAR(255) UNIQUE,
  status VARCHAR(50),
  amount DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'BRL',
  paymentMethod VARCHAR(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (enrollmentId) REFERENCES enrollments(id),
  INDEX (mpPaymentId),
  INDEX (status)
);
