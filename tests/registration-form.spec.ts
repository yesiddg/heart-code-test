/* eslint-disable import/default */
import { mount, createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import VueRouter from 'vue-router'
import { ValidationError } from '@private-package/core'

// Import components
// @ts-ignore
import Dropdown from 'primevue/dropdown/dropdown.umd'
// @ts-ignore
import InputMask from 'primevue/inputmask/inputmask.umd'
// @ts-ignore
import InputText from 'primevue/inputtext/inputtext.umd'
// @ts-ignore
import LiteRegistrationForm from '@/components/LiteRegistrationForm.vue'

/**
 * We need to create a local copy of vue to avoid dirty the original Vue instance.
 * Also We register globally the primevue components we need.
 */
const localVue = createLocalVue()
const router = new VueRouter()

localVue.use(VueRouter)

localVue.component('Dropdown', Dropdown)
localVue.component('InputMask', InputMask)
localVue.component('InputText', InputText)

/**
 * Mount a LiteRegistrationForm for testing and return a wrapper.
 *
 * @param mocks
 * @returns
 */
const factory = (mocks?: object) => {
  return mount(LiteRegistrationForm, {
    localVue,
    router,
    mocks: {
      // TODO: Check how to mock nuxt stuff
      $nuxt: {
        $emit() { },
      },
      ...mocks,
    },
  })
}

const BUSINESS_NAME_SELECTOR = '#businessName'
const BUSINESS_CITY_SELECTOR = '#businessCity'
const BUSINESS_STATE_SELECTOR = '#businessStateDropdown'
const BUSINESS_ZIP_CODE_SELECTOR = '#businessZipCode'
const BUSINESS_ADDRESS_SELECTOR = '#businessAddress'
const BUSINESS_BUSINESS_PHONE_NUMBER_SELECTOR = '#businessPhoneNumber'
const BUSINESS_FIRST_NAME_SELECTOR = '#firstName'
const BUSINESS_LAST_NAME_SELECTOR = '#lastName'
const BUSINESS_ROLE_SELECTOR = '#roleDropdown'
const BUSINESS_PHONE_NUMBER_SELECTOR = '#phoneNumber'
const BUSINESS_EMAIL_SELECTOR = '#email'
const BUSINESS_PASSWORD_SELECTOR = '#password'
const SUBMIT_BUTTON_SELECTOR = 'button[type="submit"]'

/**
 * Initial state of the form.
 */
describe('Initial form render', () => {
  const wrapper = factory()

  test('should render an empty business name field', () => {
    const input = wrapper.find(BUSINESS_NAME_SELECTOR)
    expect(input.text()).toBe('')
  })

  test('should render an empty business city field', () => {
    const input = wrapper.find(BUSINESS_CITY_SELECTOR)
    expect(input.text()).toBe('')
  })

  test('should render an unselected business state dropdown', () => {
    const dropdown = wrapper.find(
      `${BUSINESS_STATE_SELECTOR} .p-dropdown-label-empty`
    )
    expect(dropdown.exists()).toBeTruthy()
  })

  test('should render an empty business zip code field', () => {
    const input = wrapper.find(BUSINESS_ZIP_CODE_SELECTOR)
    expect(input.text()).toBe('')
  })

  test('should render an empty business address field', () => {
    const input = wrapper.find(BUSINESS_ADDRESS_SELECTOR)
    expect(input.text()).toBe('')
  })

  test('should render an empty business phone number field', () => {
    const input = wrapper.find(BUSINESS_BUSINESS_PHONE_NUMBER_SELECTOR)
    expect(input.text()).toBe('')
  })

  test('should render an empty first name field', () => {
    const input = wrapper.find(BUSINESS_FIRST_NAME_SELECTOR)
    expect(input.text()).toBe('')
  })

  test('should render an empty last name field', () => {
    const input = wrapper.find(BUSINESS_LAST_NAME_SELECTOR)
    expect(input.text()).toBe('')
  })

  test('should render an unselected role dropdown', () => {
    const dropdown = wrapper.find(
      `${BUSINESS_ROLE_SELECTOR} .p-dropdown-label-empty`
    )
    expect(dropdown.exists()).toBeTruthy()
  })

  test('should render an empty phone number field', () => {
    const input = wrapper.find(BUSINESS_PHONE_NUMBER_SELECTOR)
    expect(input.text()).toBe('')
  })

  test('should render an empty email field', () => {
    const input = wrapper.find(BUSINESS_EMAIL_SELECTOR)
    expect(input.text()).toBe('')
  })

  test('should render an empty password field', () => {
    const input = wrapper.find(BUSINESS_PASSWORD_SELECTOR)
    expect(input.text()).toBe('')
  })
})

/**
 * Form validations.
 */
describe('Form validations', () => {
  test('email field should display an invalid email format error', async () => {
    const wrapper = factory()
    await wrapper.setData({
      formData: {
        email: 'jhon.smith',
      },
    })

    await wrapper.find(SUBMIT_BUTTON_SELECTOR).trigger('submit')
    expect(wrapper.find('#emailError').text()).toMatch(
      'Value is not a valid email address'
    )
  })
})

/**
 * Submit.
 */
describe('Form submitting', () => {
  test('all fields must have an invalid classname', async () => {
    const wrapper = factory()
    await wrapper.find(SUBMIT_BUTTON_SELECTOR).trigger('submit')

    expect(wrapper.findAll('.p-invalid')).toHaveLength(12)
  })

  test('all fields must display an error message', async () => {
    const wrapper = factory()
    await wrapper.find(SUBMIT_BUTTON_SELECTOR).trigger('submit')

    expect(wrapper.findAll('.input-error')).toHaveLength(12)
  })

  test('email field should display an email already exist error', async () => {
    const wrapper = factory({
      $userService: {
        createServiceProviderUser: (data: any) =>
          Promise.reject(
            new ValidationError(
              'An account with the given email already exists',
              { email: 'An account with the given email already exists' }
            )
          ),
      },
    })

    await wrapper.setData({
      formData: {
        firstName: 'Jhon adam',
        lastName: 'Smith bond',
        email: 'jhon.smith@koombea.com',
        phoneNumber: '3282828888',
        role: 'dispatcher',
        password: 'Abcd1234!',
        businessName: 'company S.A.S',
        businessState: 'Kansas',
        businessCity: 'Wichita',
        businessZipCode: '67228',
        businessAddress: '159th St E, WICHITA, KS 67228',
        businessPhoneNumber: '3282828888',
      },
    })

    await wrapper.find(SUBMIT_BUTTON_SELECTOR).trigger('submit')
    await flushPromises()

    expect(wrapper.findAll('#email.p-invalid')).toHaveLength(1)
  })
})
