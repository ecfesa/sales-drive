import { StyleSheet, View } from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';

type OptionSelectorProps = {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
};

type Option = {
  label: string;
  value: string;
};

export default function OptionSelector({
  options,
  selectedValues,
  onChange,
  placeholder = 'Select items',
  searchPlaceholder = 'Search...',
  disabled = false,
}: OptionSelectorProps) {
  return (
    <View className="px-4 pt-2">
      <MultiSelect
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        selectedStyle={styles.selectedStyle}
        itemTextStyle={styles.itemTextStyle}
        containerStyle={styles.container}
        itemContainerStyle={styles.itemContainerStyle}
        data={options}
        search
        searchPlaceholder={searchPlaceholder}
        placeholder={placeholder}
        maxHeight={300}
        labelField="label"
        valueField="value"
        value={selectedValues}
        onChange={onChange}
        disable={disabled}
        activeColor="#EEF2FF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  dropdown: {
    height: 56,
    backgroundColor: 'transparent',
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 1,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#757575',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#6367F1',
  },
  iconStyle: {
    width: 24,
    height: 24,
  },
  inputSearchStyle: {
    height: 48,
    fontSize: 16,
    borderRadius: 4,
    backgroundColor: '#F5F5F5',
  },
  icon: {
    marginRight: 8,
  },
  selectedStyle: {
    borderRadius: 9999,
    backgroundColor: '#EEF2FF',
    borderColor: '#6367F1',
    borderWidth: 1,
    marginTop: 8,
  },
  itemTextStyle: {
    fontSize: 14,
    color: '#212121',
  },
  itemContainerStyle: {
    borderRadius: 4,
    marginVertical: 6,
  },
});
