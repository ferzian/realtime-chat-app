import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Masuk ke Akun"
      subtitle="Masukkan email dan password anda"
    >
      <LoginForm />
    </AuthLayout>
  );
}
