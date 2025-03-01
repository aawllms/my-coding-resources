import { Schema, Date, type Document } from "mongoose";

export interface CategoryDocument extends Document {
  categoryID: string;
  language: string;
  type: string;
  description: string;
  createdOn: Date;
}

const categorySchema = new Schema<CategoryDocument>({
  language: {
    type: String,
  },
  type: {
    type: String,
    // index: true,
    // sparse: true,
    // required: true,
    // unique: true,
  },
  description: {
    type: String,
  },
});

export default categorySchema;
