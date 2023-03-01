
drop database cobranca;

create table usuarios (
  id serial primary key,
  nome text not null,
  email text not null unique,
  senha text not null,
  cpf text unique,
  telefone text
);

create table clientes (
  id serial primary key,
  nome text not null,
  email text not null unique,
  cpf text not null unique,
  telefone text not null,
  cep text ,
  logradouro text,
  complemento text,
  bairro text,
  cidade text ,
  estado text 
);

create table cobrancas (
  id serial primary key,
  id_cliente integer not null,
  nome text not null,
  descricao text not null,
  valor numeric not null,
  vencimento date not null,
  status text ,
  foreign key (id_cliente) references clientes(id)
);