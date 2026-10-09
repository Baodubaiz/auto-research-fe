import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/providers/AuthProvider';
import { authService } from '../services/auth.service';
import { LoginPayload, RegisterPayload } from '../types/auth.type';
import { ROUTES } from '@/lib/constants';

export function useAuthActions() {
  const router = useRouter();
  const { login: setAuth, logout: clearAuth } = useAuth();

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (data) => {
      setAuth(data.accessToken, data.user);
      toast.success('Logged in successfully!');
      router.push(ROUTES.DASHBOARD.HOME);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Invalid username or password';
      toast.error(Array.isArray(message) ? message.join(', ') : message);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (data) => {
      setAuth(data.accessToken, data.user);
      toast.success('Account registered successfully!');
      router.push(ROUTES.DASHBOARD.HOME);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Registration failed';
      toast.error(Array.isArray(message) ? message.join(', ') : message);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      clearAuth();
      toast.success('Logged out successfully');
      router.push(ROUTES.AUTH.LOGIN);
    },
  });

  return {
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
}

