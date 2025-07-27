import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

interface ProfileData {
  name: string;
  email: string;
  semester: string;
  college: string;
  avatarUrl?: string;
}

interface EditProfileFormProps {
  defaultValues: ProfileData;
  onSubmit: SubmitHandler<ProfileData>;
  isSubmitting: boolean;
}

const semesters = [
  '1st',
  '2nd',
  '3rd',
  '4th',
  '5th',
  '6th',
  '7th',
  '8th',
];

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  defaultValues,
  onSubmit,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileData>({
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          {...register('name', { required: 'Name is required', minLength: { value: 3, message: 'Name must be at least 3 characters' } })}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.name ? 'border-red-500' : ''
          }`}
          disabled={isSubmitting}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
          })}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.email ? 'border-red-500' : ''
          }`}
          disabled={isSubmitting}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
          Semester
        </label>
        <select
          id="semester"
          {...register('semester', { required: 'Semester is required' })}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.semester ? 'border-red-500' : ''
          }`}
          disabled={isSubmitting}
        >
          <option value="">Select Semester</option>
          {semesters.map((sem) => (
            <option key={sem} value={sem}>
              {sem}
            </option>
          ))}
        </select>
        {errors.semester && <p className="mt-1 text-sm text-red-600">{errors.semester.message}</p>}
      </div>

      <div>
        <label htmlFor="college" className="block text-sm font-medium text-gray-700">
          College
        </label>
        <input
          id="college"
          type="text"
          {...register('college', { required: 'College is required', minLength: { value: 2, message: 'College name is too short' } })}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.college ? 'border-red-500' : ''
          }`}
          disabled={isSubmitting}
        />
        {errors.college && <p className="mt-1 text-sm text-red-600">{errors.college.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
};

export default EditProfileForm;
