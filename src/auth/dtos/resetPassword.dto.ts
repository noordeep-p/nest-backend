export default interface ResetPasswordDto {
  token: string;
  password: string;
  confirmPassword: string;
}
