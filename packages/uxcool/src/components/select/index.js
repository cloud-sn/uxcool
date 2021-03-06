import Select from './select';
import Option from './option';
import OptionGroup from './optionGroup';

Select.Option = Option;
Select.OptionGroup = OptionGroup;
Select.Group = OptionGroup;

export { Select as UxSelect, Option as UxOption, OptionGroup as UxOptionGroup };

export default Select;
