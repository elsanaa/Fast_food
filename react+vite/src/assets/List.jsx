import React from 'react';


const List = ({ list, onRemoveItem }) => {
  return (
    <ul>
      {list.map(item => (
        <Item
          key={item.objectID}
          item={item}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </ul>
  );
};


const Item = ({ item, onRemoveItem }) => {
  const handleClick = () => {
    onRemoveItem(item);
  }; 

  return (
    <li>
      <a href={item.url} >{item.title}</a>
      {' '}
      <button type="button" onClick={()=> onRemoveItem(item)}>
        Remove
      </button>
    </li>
  );

};

export default List;
