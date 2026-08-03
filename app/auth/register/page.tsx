import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create an Account"
      subtitle="Fill in your details below to start chatting"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
