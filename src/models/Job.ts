import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  slug: string;
  category:
    | 'latest-jobs'
    | 'admit-card'
    | 'result'
    | 'syllabus'
    | 'admission'
    | 'flash-banner'
    | 'top-banner'
    | 'top-update';
  department?: string;
  postDate?: string;
  applyStartDate?: string;
  applyEndDate?: string;
  feeGeneral?: string;
  feeSCST?: string;
  ageMin?: string;
  ageMax?: string;
  totalPost?: string;
  eligibility?: string;
  applyLink?: string;
  loginLink?: string;            // Bas login link job ke hisab se badlega
  notificationLink?: string;
  officialWebsite?: string;
  isTrending?: boolean;
  isFlashBanner?: boolean;
}

const JobSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    department: { type: String },
    postDate: { type: String },
    applyStartDate: { type: String },
    applyEndDate: { type: String },
    feeGeneral: { type: String },
    feeSCST: { type: String },
    ageMin: { type: String },
    ageMax: { type: String },
    totalPost: { type: String },
    eligibility: { type: String },
    applyLink: { type: String },
    loginLink: { type: String },
    notificationLink: { type: String },
    officialWebsite: { type: String },
    isTrending: { type: Boolean, default: false },
    isFlashBanner: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);