export default class UserDto {
    email: string
    id: string
    feedback: string

    constructor(model) {
        this.email = model.email
        this.id = model._id
        this.feedback = model.feedback
    }
}
