import { Text, View } from 'react-native';
import { styles } from '../style';

const colors = { green: { background: 'rgba(81, 203, 75, 0.2)', color: 'rgba(81, 203, 75, 0.99)' } };
let color = '';
export function TagType1({ children, addStyle, addStyleText, country, ...props }) {
  color = children === 'Próximamente' && 'green';
  let colorStyle = color ? { backgroundColor: { backgroundColor: colors[color].background }, color: { color: colors[color].color } } : '';

  return (
    <View style={[styles.tagType1, addStyle, colorStyle.backgroundColor, { flexDirection: 'row' }]}>
      <Text style={[styles.tagType1Text, colorStyle.color, addStyleText]}>{children}</Text>
      {country && <Text style={[{ fontSize: 18, marginTop: -2, marginRight: -2, marginLeft: 2 }]}>{country}</Text>}
    </View>
  );
}
