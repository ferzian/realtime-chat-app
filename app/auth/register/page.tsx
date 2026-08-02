import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout title="Buat Akun Baru" subtitle="Lengkapi data di bawah ini">
      <RegisterForm />
    </AuthLayout>
  );
}
