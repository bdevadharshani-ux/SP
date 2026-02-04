const EmptyState = ({ title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm mt-2 text-center max-w-md">
        {description}
      </p>
    </div>
  );
};

export default EmptyState;
