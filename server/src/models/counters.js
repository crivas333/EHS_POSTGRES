import mongoose, { Schema } from 'mongoose'

const { ObjectId } = Schema.Types

const countersSchema = new Schema({
  _id: String,
  sequence_value: Number
})

export default mongoose.model('Counters', countersSchema)
