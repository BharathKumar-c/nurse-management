export const calculateAgeFromDOB = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
};

export const buildSortingClause = (field = 'id', order = 'desc') => {
  const allowedFields = new Set(['id', 'name', 'license_number', 'date_of_birth', 'age', 'created_at']);
  const direction = order?.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
  const sortField = allowedFields.has(field) ? field : 'id';
  return `ORDER BY ${sortField} ${direction}`;
};

