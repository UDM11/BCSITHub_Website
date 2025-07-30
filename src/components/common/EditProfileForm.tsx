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
  { value: '1', label: '1st Semester' },
  { value: '2', label: '2nd Semester' },
  { value: '3', label: '3rd Semester' },
  { value: '4', label: '4th Semester' },
  { value: '5', label: '5th Semester' },
  { value: '6', label: '6th Semester' },
  { value: '7', label: '7th Semester' },
  { value: '8', label: '8th Semester' },
];

const colleges = [
  { value: 'Pokhara University', label: 'Pokhara University' },
  { value: 'Ace Institute of Management', label: 'Ace Institute of Management' },
  { value: 'SAIM College', label: 'SAIM College' },
  { value: 'Apollo International College', label: 'Apollo International College' },
  { value: 'Quest International College', label: 'Quest International College' },
  { value: 'Shubhashree College of Management', label: 'Shubhashree College of Management' },
  { value: 'Liberty College', label: 'Liberty College' },
  { value: 'Uniglobe College', label: 'Uniglobe College' },
  { value: 'Medhavi College', label: 'Medhavi College' },
  { value: 'Crimson College of Technology', label: 'Crimson College of Technology' },
  { value: 'Rajdhani Model College', label: 'Rajdhani Model College' },
  { value: 'Excel Business College', label: 'Excel Business College' },
  { value: 'Malpi International College', label: 'Malpi International College' },
  { value: 'Nobel College', label: 'Nobel College' },
  { value: 'Boston International College', label: 'Boston International College' },
  { value: 'Pokhara College of Management', label: 'Pokhara College of Management' },
  { value: 'Apex College', label: 'Apex College' },
  { value: 'Other', label: 'Other College' },
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md space-y-6 bg-white p-6 rounded-lg shadow-md"
    >
      {/* Name - Disabled */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
          disabled
        />
      </div>

      {/* Email - Disabled */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
          disabled
        />
      </div>

      {/* Semester - Editable */}
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
            <option key={sem.value} value={sem.value}>
              {sem.label}
            </option>
          ))}
        </select>
        {errors.semester && (
          <p className="mt-1 text-sm text-red-600">{errors.semester.message}</p>
        )}
      </div>

      {/* College - Editable */}
      <div>
        <label htmlFor="college" className="block text-sm font-medium text-gray-700">
          College
        </label>
        <select
          id="college"
          {...register('college', { required: 'College is required' })}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.college ? 'border-red-500' : ''
          }`}
          disabled={isSubmitting}
        >
          <option value="">Select College</option>
          {colleges.map((college) => (
            <option key={college.value} value={college.value}>
              {college.label}
            </option>
          ))}
        </select>
        {errors.college && (
          <p className="mt-1 text-sm text-red-600">{errors.college.message}</p>
        )}
      </div>

      {/* Submit Button */}
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
