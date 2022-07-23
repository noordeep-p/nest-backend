export default interface UpdatePasswordDto {
  oldPassword?: string;
  password?: string;
  confirmPassword?: string;
}
