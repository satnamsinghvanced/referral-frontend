const FolderBreadcrumb = ({ path, onNavigate }: any) => (
  <p className="text-sm flex items-center space-x-1">
    <span
      className="cursor-pointer hover:underline underline-offset-2"
      onClick={() => onNavigate(null)}
    >
      Root
    </span>
    {path.map((item: any) => (
      <span key={item.id} className="flex items-center space-x-1">
        <span className="text-gray-400">/</span>
        <span
          className="cursor-pointer hover:underline underline-offset-2"
          onClick={() => onNavigate(item.id)}
        >
          {item.name}
        </span>
      </span>
    ))}
  </p>
);

export default FolderBreadcrumb;
