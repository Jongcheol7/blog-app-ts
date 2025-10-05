type Props = {
  label: string;
  id: string;
  isDisabled: boolean;
  defaultVal: boolean;
};

export default function LabelCheckbox({
  label,
  id,
  isDisabled,
  defaultVal,
}: Props) {
  return (
    <div>
      <label htmlFor={id} className="text-gray-600 mr-1">
        {label}
      </label>
      <input
        id={id}
        type="checkbox"
        defaultChecked={defaultVal}
        disabled={isDisabled ? true : false}
      />
    </div>
  );
}
