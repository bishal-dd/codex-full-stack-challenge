import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { useLocalStorage } from '@vueuse/core';
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const JwtSchema = Type.Object({
  'exp': Type.Number(),
  'custom:admin': Type.Optional(Type.String()),
});

function parseJwt(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );

  const jwt = JSON.parse(jsonPayload) as unknown;
  return Value.Parse(JwtSchema, jwt);
}

export function useAuth() {
  const jwtToken = useLocalStorage<string | null>('cognito_jwt', null);

  const parsedJwt = computed(() => jwtToken.value && parseJwt(jwtToken.value));
  const isAuthenticated = () => parsedJwt.value && parsedJwt.value.exp * 1000 > Date.now();
  const isAdmin =
    parsedJwt.value !== null && typeof parsedJwt.value === 'object' && parsedJwt.value['custom:admin'] === 'true';

  const route = useRoute();
  const router = useRouter();

  function getUrlHashParams() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    return params;
  }

  function redirectToLogin() {
    const cognitoDomain = `${import.meta.env.VITE_COGNITO_DOMAIN}.auth.${import.meta.env.VITE_AWS_REGION}.amazoncognito.com`;
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
    const redirectUri = encodeURIComponent(window.location.origin);
    const state = encodeURIComponent(route.fullPath);
    const loginUrl = `https://${cognitoDomain}/login?client_id=${clientId}&response_type=token&scope=profile+email+openid&redirect_uri=${redirectUri}&state=${state}`;
    window.location.href = loginUrl;
  }

  async function checkAuth() {
    try {
      // Check if the JWT is in the URL hash after login
      const params = getUrlHashParams();
      const token = params.get('id_token');
      if (token) {
        jwtToken.value = token;
        const state = decodeURIComponent(params.get('state') ?? '');
        await router.replace(state || route.fullPath);
        return;
      }

      // Check if JWT is already stored
      if (!isAuthenticated()) {
        redirectToLogin();
      }
    } catch {
      jwtToken.value = null;
      redirectToLogin();
    }
  }

  onMounted(async () => {
    await checkAuth();
  });

  return {
    isAdmin,
    jwtToken,
    isAuthenticated,
  };
}
