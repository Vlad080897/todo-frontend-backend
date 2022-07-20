import { FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import { globalStyles } from '../styles/commonStyles'


const data = [
  {
    desc: 'afasfasf'
  },
  {
    desc: 'afoianfknqf'
  }
]

const Todo = () => {

  const handleRender: ListRenderItem<{ desc: string }> = ({ item }) => {
    return (
      <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', backgroundColor: 'yellow' }} >
        <BouncyCheckbox
          style={{ ...globalStyles.checkBoxIcon, borderTopWidth: 1, borderTopColor: 'black' }}
          fillColor={'black'}
        />
        <Text
          style={{ ...globalStyles.input, borderTopWidth: 1, borderTopColor: 'red' }}
        >{item.desc}</Text>
      </View>
    )
  }

  return (
    <>
      <View>
        <FlatList
          data={data}
          renderItem={handleRender}
          style={{ backgroundColor: 'green' }}
        />
      </View>

    </>
  )
}

export default Todo

const styles = StyleSheet.create({
  todoList: {

  }

})