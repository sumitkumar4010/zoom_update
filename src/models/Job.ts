import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  slug: string;
  organization?: string;
  postName?: string;
  category?: string;
  jobType?: string;
  jobLocation?: string;
  totalVacancy?: string;
  notificationDate?: string;
  applyStartDate?: string;
  applyEndDate?: string;
  feePaymentLastDate?: string;
  correctionLastDate?: string;
  examDate?: string;
  admitCardDate?: string;
  resultDate?: string;
  feeGeneral?: string;
  feeSCST?: string;
  feeEWS?: string;
  feeMode?: string;
  educationalQualification?: string;
  ageMin?: string;
  ageMax?: string;
  ageRelaxation?: string;
  salaryPayScale?: string;
  gradePay?: string;
  experienceRequired?: string;
  selectionProcess?: string;
  vacancies?: Array<{
    categoryName?: string;
    ur?: string;
    obc?: string;
    sc?: string;
    st?: string;
    ews?: string;
    total?: string;
  }>;
  thumbnailUrl?: string;
  notificationPdfUrl?: string;
  howToApply?: string;
  applyLink?: string;
  officialWebsite?: string;
  notificationLink?: string;
  syllabusLink?: string;
  admitCardLink?: string;
  answerKeyLink?: string;
  resultLink?: string;
  seoTitle?: string;
  metaDescription?: string;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    organization: String,
    postName: String,
    category: {
      type: String,
      enum: [
        'admit-card',
        'latest-jobs',
        'current-job',
        'result',
        'answer-key',
        'syllabus',
        'admission',
        'university-update',
        'scholarship',
        'upcoming-job',
        'sarkari-yojana',
        'yojana',
        'documents',
        'document',
        'blog',
        'latest-blog',
        'top-banner',
        'top-update'
      ],
      required: true,
    },
    jobType: String,
    jobLocation: String,
    totalVacancy: String,
    notificationDate: String,
    applyStartDate: String,
    applyEndDate: String,
    feePaymentLastDate: String,
    correctionLastDate: String,
    examDate: String,
    admitCardDate: String,
    resultDate: String,
    feeGeneral: String,
    feeSCST: String,
    feeEWS: String,
    feeMode: String,
    educationalQualification: String,
    ageMin: String,
    ageMax: String,
    ageRelaxation: String,
    salaryPayScale: String,
    gradePay: String,
    experienceRequired: String,
    selectionProcess: String,
    vacancies: [
      {
        categoryName: String,
        ur: String,
        obc: String,
        sc: String,
        st: String,
        ews: String,
        total: String,
      },
    ],
    thumbnailUrl: String,
    notificationPdfUrl: String,
    howToApply: String,
    applyLink: String,
    officialWebsite: String,
    notificationLink: String,
    syllabusLink: String,
    admitCardLink: String,
    answerKeyLink: String,
    resultLink: String,
    seoTitle: String,
    metaDescription: String,
  },
  { timestamps: true }
);

export default mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);