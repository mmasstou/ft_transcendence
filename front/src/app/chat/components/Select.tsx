import { FC } from "react";
import ReactSelect from "react-select";
interface SelectProps {
    lable: string;
    value?: Record<string, any>;
    onChange?: (value: Record<string, any>) => void;
    options: Record<string, any>[];
    isMulti?: boolean;
    disabled?: boolean;
}
const Select: FC<SelectProps> = ({ lable, value, onChange, options, isMulti, disabled }) => {
    const customStyles = {
        multiValue: (provided: any, state: any) => ({
            ...provided,
            color: 'white',
            padding: '0.5rem',


        }),
        multiValueRemove: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: 'gray-300',
            color: 'red',
            borderRadius: '9999px',
            ':hover': {
                backgroundColor: 'transparent'
            }
        }),
        control: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: 'transparent',
            padding: state.isSelected ? '0.8rem' : '0.5rem',
            border: '1px solid #E0E0E0',

        }),
        menuPortal: (base: any) => ({ ...base, zIndex: 52 })
    };
    return (
        <div className="z-[51]">
            <h1 className="text-[#ffffffb9] text-xl font-bold capitalize">{lable}</h1>
            <div className="mt-2 h-max overflow-y-scroll">
                <ReactSelect
                    isDisabled={disabled}
                    value={value}
                    onChange={onChange}
                    isMulti
                    options={options}
                    menuPortalTarget={document.body}
                    styles={customStyles}
                    classNames={{
                        control: () => "text-sm"
                    }}
                />
            </div>
        </div>
    )
}
export default Select;
