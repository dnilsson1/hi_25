import React from 'react';

type HelloProps = {
  name?: string;
};

const Hello = ({ name }: HelloProps) => {
  return <div>Hello, {name ? name : 'World'}!</div>;
};

export default Hello;