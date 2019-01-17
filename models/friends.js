// 
schema {
  user1: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  user2: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
  accepted: {type: Boolean, default: false }
}