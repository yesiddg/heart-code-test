import GeneralInternalError from 'errors/general-internal-error'
import ValidationError from '../../errors/validation-error'
import CrudDao from '../crud-dao'
import UsersResponseManager from './response-manager'

export default class UsersDao extends CrudDao {
  static baseEndpoint = 'users'

  /**
   * Map field names given by backend to the names assigned in the frontend.
   */
  static mappedFields = {
    userRole: 'role',
  }

  /**
   * Create an instance of a UsersDao;
   *
   * @param httpClient
   */
  constructor(httpClient) {
    super(UsersDao.baseEndpoint, httpClient, new UsersResponseManager())
  }

  /**
   * Create a new user resource.
   *
   * @param data
   * @returns {Promise}
   */
  create(data) {
    const _data = {
      userInformation: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        userPassword: data.password,
        phoneNumber: data.phoneNumber,
        userRole: data.role,
      },
      businessInformation: {
        businessName: data.businessName,
        businessPhoneNumber: data.businessPhoneNumber,
        businessAddress: data.businessAddress,
        businessCity: data.businessCity,
        businessState: data.businessState,
        businessZipCode: data.businessZipCode,
      },
    }

    return super
      .create(_data, '/v1/users', {})
      .catch((error) => {
        // Fields returned by backend doesn't match the structure you decide to use in frontend
        // So we need to map these fields the interface used in frontend.

        if (error instanceof ValidationError) {
          this.mapErrorFields(error)
        } else if (this.isUsernameExistsError(error)) {
          throw new ValidationError(
            ValidationErrors.DUPLICATED_EMAIL,
            {
              email: ValidationErrors.DUPLICATED_EMAIL,
            }
          )
        }

        // Throw a generic or not validated scenary.
        throw new Error(ValidationErrors.GENERIC_ERROR)
      })
  }

  /**
   * Register a new full user.
   *
   * @param data
   * @returns
   */
  createFull(data) {
    const _data = {
      userInformation: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        userPassword: data.password,
        phoneNumber: data.phoneNumber,
      },
      businessInformation: {
        businessName: data.businessName,
        businessPhoneNumber: data.businessPhoneNumber,
        businessAddress: data.businessAddress,
        businessCity: data.businessCity,
        businessState: data.businessState,
        businessZipCode: data.businessZipCode,
      },
      serviceArea: {
        radiusMiles: data.serviceArea,
      },
      fees: data.services.map((service) => ({
        serviceName: service.name,
        baseFee: service.fee,
      })),
      dispatchers: data.dispatchers,
      operators: data.operators,
      vehicles: data.vehicles,
      termsOfService: {
        insuranceCertified: data.hasInsurance,
        termsOfService: data.acceptTerms,
        privacyPolicy: data.acceptTerms,
      },
    }

    return this.httpClient
      .post('/v1/register', _data)
      .then(() => {
        // TODO: This is a mock. It should transform the backend response in a DTO object.
        return {
          id: '1',
          name: 'Jhon Smith',
          email: 'jhon.smith@gmail.com',
        }
      })
      .catch((error) => {
        if (this.isUsernameExistsError(error)) {
          throw new ValidationError(
            ValidationErrors.DUPLICATED_EMAIL,
            {
              email: ValidationErrors.DUPLICATED_EMAIL,
            }
          )
        }

        throw new GeneralInternalError()
      })
  }

  /**
   * Check if the current error is if the username/email already exists.
   *
   * @param {AxiosError} error
   * @returns boolean
   */
  isUsernameExistsError(error) {
    const data = error.response?.data
    const errorMessage = data?.Error || data?.error || data?.msg

    if (!errorMessage) return false

    return (
      errorMessage.includes('UsernameExistsException') ||
      errorMessage.includes('already exists')
    )
  }

  /**
   * Map the errors and replace the keys returned by backend by the names used in frontend.
   *
   * @param {ValidationError}
   */
  mapErrorFields(error) {
    const keys = Object.keys(error.errors)

    keys.forEach((key) => {
      const mappedKey = UsersDao.mappedFields[key]

      if (mappedKey) error.replaceErrorField(key, mappedKey)
    })
  }
}
