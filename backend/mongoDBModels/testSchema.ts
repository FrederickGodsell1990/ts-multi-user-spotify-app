import mongoose from "mongoose";
// extract the schema from that mongoose object
const Schema = mongoose.Schema;
// create a new post schema
const testDataSchema = new Schema({
  testData: {
    type: String,
    required: true
  }
});
// export the model
export default mongoose.model('testDataSchema', testDataSchema);

