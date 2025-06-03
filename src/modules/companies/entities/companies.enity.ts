
import { Prop, Schema, SchemaFactory,} from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Company extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: false }) 
  password?: string;

  @Prop({ required: true, unique: true }) 
  email: string;

  @Prop({ sparse: true, unique: true }) 
  googleId?: string;

  @Prop({ default: false }) 
  is_verified: boolean;
}

export const companyschema = SchemaFactory.createForClass(Company)
