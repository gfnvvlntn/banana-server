export default class UserDto {
    email
    id
    feedback

    constructor(model) {
        this.email = model.email
        this.id = model._id
        this.feedback = model.feedback
    }
}
