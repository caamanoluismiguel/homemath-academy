-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subscription" TEXT NOT NULL DEFAULT 'trial',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "children" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "preferredGrade" TEXT NOT NULL,
    "preferredLang" TEXT NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "children_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "placement_test_results" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "gradeLevel" TEXT NOT NULL,
    "responses" JSONB NOT NULL,
    "score" DOUBLE PRECISION,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "dateCompleted" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "placement_test_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insight_reports" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "strengths" TEXT[],
    "weaknesses" TEXT[],
    "gradeEquivalence" TEXT NOT NULL,
    "commonErrors" TEXT[],
    "theologyNote" TEXT NOT NULL,
    "aiSummary" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "insight_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "growth_plans" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "reportId" TEXT,
    "planStructure" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "growth_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "week_details" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "weekTheme" TEXT,
    "mathConcept" TEXT NOT NULL,
    "theology" TEXT,
    "dailyLessons" JSONB,
    "isGenerated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "week_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_lesson_details" (
    "id" TEXT NOT NULL,
    "weekDetailId" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "dayTitle" TEXT NOT NULL,
    "devotional" JSONB NOT NULL,
    "learningObjective" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "guidedExamples" JSONB NOT NULL,
    "mainExercises" JSONB NOT NULL,
    "commonMistakes" JSONB NOT NULL,
    "parentDiscussion" JSONB NOT NULL,
    "homework" JSONB NOT NULL,
    "closingEncouragement" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_lesson_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progress_logs" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "activity" TEXT NOT NULL,
    "timeSpent" INTEGER,
    "mastery" TEXT NOT NULL,
    "notes" TEXT,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "progress_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_forms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "formType" TEXT NOT NULL DEFAULT 'general',
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weekly_quizzes" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "mathConcept" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "totalQuestions" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "weekly_quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_attempts" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "responses" JSONB NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "timeSpent" INTEGER,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "attemptNumber" INTEGER NOT NULL DEFAULT 1,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "quiz_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "badges" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "badgeType" TEXT NOT NULL,
    "badgeName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iconName" TEXT NOT NULL,
    "colorScheme" TEXT NOT NULL,
    "weekNumber" INTEGER,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "week_details_planId_weekNumber_key" ON "week_details"("planId", "weekNumber");

-- CreateIndex
CREATE UNIQUE INDEX "daily_lesson_details_weekDetailId_dayNumber_key" ON "daily_lesson_details"("weekDetailId", "dayNumber");

-- CreateIndex
CREATE UNIQUE INDEX "weekly_quizzes_childId_weekNumber_key" ON "weekly_quizzes"("childId", "weekNumber");

-- AddForeignKey
ALTER TABLE "children" ADD CONSTRAINT "children_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "placement_test_results" ADD CONSTRAINT "placement_test_results_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insight_reports" ADD CONSTRAINT "insight_reports_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insight_reports" ADD CONSTRAINT "insight_reports_testId_fkey" FOREIGN KEY ("testId") REFERENCES "placement_test_results"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "growth_plans" ADD CONSTRAINT "growth_plans_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "growth_plans" ADD CONSTRAINT "growth_plans_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "insight_reports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "week_details" ADD CONSTRAINT "week_details_planId_fkey" FOREIGN KEY ("planId") REFERENCES "growth_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_lesson_details" ADD CONSTRAINT "daily_lesson_details_weekDetailId_fkey" FOREIGN KEY ("weekDetailId") REFERENCES "week_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress_logs" ADD CONSTRAINT "progress_logs_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weekly_quizzes" ADD CONSTRAINT "weekly_quizzes_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "weekly_quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "badges" ADD CONSTRAINT "badges_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;
