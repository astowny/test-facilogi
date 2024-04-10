import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export const useValidate = () => {
  const { t } = useI18n()

  const emailRules = computed(() => [
    (v: string) => !!v || t('login.error.emailRequired'),
    (v: string) => /.+@.+\..+/.test(v) || t('login.error.emailInvalid'),
  ])

  const required = computed(() => [
    (v: string) => !!v || t('accountForm.fieldRequired'),
  ])

  return { emailRules, required }
}
