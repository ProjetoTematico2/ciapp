import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom'
import Title from "../layout/Title";
import { toast } from 'react-toastify';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { Nav, NavItem, Tab, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import Table from '../layout/Table';
import ModalTarefa from './ModalTarefa';
import { confirmAlert } from "react-confirm-alert";
import Endereco from "../layout/Endereco";



const Create = () => {
    const navigate = useNavigate();
    const [tempID, setempID] = useState(0);
    const { id } = useParams();

    const [entidade, setEntidade] = useState({
        nome: '',
        cnpj: '',
        telefone1: '',
        telefone2: '',
        email: '',
        tarefas: [],
        tipoInstituicao: 0,
        status: true
    });

    const [endereco, setEndereco] = useState({
        rua: '',
        cep: '',
        numero: '',
        bairro: '',
        complemento: '',
        id_cidade: ''
    });


    useEffect( () => {
        fetchData();
    }, []);

    const fetchData = async () => {
        console.log(id);

        if (id != null) {
            const data = await window.api.Action({ controller: "Entidades", action: "GetEntidade", params: id });
            console.log(data);
            // setEndereco(endereco);
            // setEntidade(entidade);
        }
    }

    const getTempID = async () => {
        setempID(tempID - 1);
        return tempID - 1;
    }

    const submitEntidade = async () => {

        const payload = {
            entidade,
            endereco
        }


        const postResult = await window.api.Action({ controller: "Entidades", action: "Create", params: payload });

        if (!postResult.status) {
            toast.error(postResult.text, { autoClose: 3000 });
        } else {
            toast.success(postResult.text, { autoClose: 3000 });
        }
    }



    const handleEntidade = (evt, prop_name = null) => {
        const value = evt.value ?? evt.target.value;

        setEntidade({
            ...entidade,
            [prop_name ? prop_name : evt.target.name]: value
        })
    }

    const handleEndereco = (evt, name = null) => {
        const value = evt.value ?? evt.target.value;

        setEndereco({
            ...endereco,
            [name ? name : evt.target.name]: value
        })
    }

    const columnsTarefa = [
        { Header: 'Titulo', accessor: 'titulo' },
        { Header: 'Descricao', accessor: 'descricao' },
        { id: 'status', Header: 'Status', accessor: d => d.status == true ? 'Ativa' : 'Inativa' }
    ];

    const [modelTarefa, setModelTarefa] = useState({
        id: null,
        titulo: '',
        descricao: '',
        status: true,
        novo_registro: true
    });

    const [showModalTarefa, setShowModalTarefa] = useState(false);


    const ModalEditTarefa = (object) => {
        HandleModalTarefa(true, object);
    }

    const HandleModalTarefa = (show = true, model = null) => {
        setModelTarefa(model);
        setShowModalTarefa(show);
    }


    const DeleteTarefa = (object) => {
        if (object) {
            confirmAlert({
                title: 'Confirmação',
                message: 'Tem certeza que deseja excluir este item?',
                buttons: [
                    {
                        label: 'Sim',
                        onClick: () => {
                            var tarefas = entidade.tarefas.filter(s => s.id !== object.id);
                            setEntidade({
                                ...entidade,
                                ["tarefas"]: tarefas
                            });
                        }
                    },
                    {
                        className: 'btn-blue',
                        label: 'Não',
                        onClick: () => {
                        }
                    }
                ]
            });
        }
    }

    const EditTarefa = (object) => {

        if (object) {
            var tarefas = entidade.tarefas;

            var exist = tarefas.find(s => s.titulo == object.titulo && s.id != object.id);

            if (exist) {
                toast.error(`Tarefa "${object.titulo}" já informado`, { autoClose: false });
                HandleModalTarefa(false);
                return;
            }



            const index = tarefas.findIndex(s => s.id == object.id);
            tarefas.splice(index, 1, object);

            setEntidade({
                ...entidade,
                ["tarefas"]: tarefas
            })
        }
        HandleModalTarefa(false, null);
    }


    const CreateTarefa = async (object) => {
        if (object) {
            var tarefas = entidade.tarefas;

            var exist = tarefas.find(s => s.titulo == object.titulo);
            if (exist) {
                toast.error(`Tarefa "${object.titulo}" já informado`, { autoClose: false });
                HandleModalTarefa(false);
                return;
            }
            if (object.novo_registro) {
                object.id = await getTempID();
            }

            tarefas.push(object);

            setEntidade({
                ...entidade,
                ["tarefas"]: tarefas
            });
        }
        HandleModalTarefa(false, null);
    }



    return (
        <>
            <Title title={"Nova entidade"} />

            <div className='menu'>

                <button className='menu-button button-green' onClick={submitEntidade}>
                    <i className='fa-solid fa-save'></i> Salvar
                </button>
                <button className='menu-button button-red' onClick={() => { navigate('/entidades') }}>
                    <i className='fa-solid fa-times'></i> Cancelar
                </button>
            </div>

            <div className="row">
                <Title title={"Dados da Entidade"} />

                <div className="col-md-12 col-sm-12 px-4">

                    <div className="form-group row">

                        <div className="col-md-4">

                            <div className="input-form">
                                <label htmlFor="nome">Nome</label>
                                <input
                                    id="nome"
                                    name="nome"
                                    className="form-control shadow-none input-custom"
                                    type="text"
                                    placeholder="Nome da entidade"
                                    value={entidade.nome}
                                    required={true}
                                    onChange={handleEntidade}
                                />
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="input-form">
                                <label htmlFor="cnpj">CNPJ</label>
                                <input
                                    id="cnpj"
                                    className="form-control shadow-none input-custom"
                                    type="text"
                                    name="cnpj"
                                    placeholder="000.000.000-00"
                                    required={true}
                                    value={entidade.cnpj}
                                    onChange={handleEntidade}
                                />
                            </div>
                        </div>

                        <div className="col-md-4">

                            <div className="input-form">
                                <label htmlFor="phone-2">Email</label>
                                <input
                                    id="email"
                                    className="form-control shadow-none input-custom"
                                    type="email"
                                    name="email"
                                    placeholder="****@***.com"
                                    required={true}
                                    value={entidade.email}
                                    onChange={handleEntidade}
                                />
                            </div>

                        </div>

                        <div className="col-md-4">
                            <div className="input-form">
                                <label htmlFor="telefone1">Telefone 1</label>
                                <input
                                    id="telefone1"
                                    className="form-control shadow-none input-custom"
                                    type={"tel"}
                                    name="telefone1"
                                    placeholder="(00) 0000-0000"
                                    required={true}
                                    value={entidade.telefone1}
                                    onChange={handleEntidade}
                                />
                            </div>
                        </div>

                        <div className="col-md-4">

                            <div className="input-form">
                                <label htmlFor="telefone2">Telefone 2 (opcional)</label>
                                <input
                                    id="telefone2"
                                    name="telefone2"
                                    className="form-control shadow-none input-custom"
                                    type="tel"
                                    value={entidade.telefone2}
                                    placeholder="(00) 0000-0000"
                                    required={false}
                                    onChange={handleEntidade}
                                />
                            </div>

                        </div>
                    </div>

                </div>

                <div className="col-md-12">

                    <div className="col-md-4 my-3 mx-3">

                        <div className="form-check form-check-inline">

                            <input className="form-check-input" type="radio" name="tipoInstituicao" id="entidade" defaultChecked onChange={handleEntidade} value="1" />
                            <label className="form-check-label" htmlFor="entidade">
                                Entidade parceira
                            </label>
                        </div>

                        <div className="form-check form-check-inline">

                            <input className="form-check-input" type="radio" name="tipoInstituicao" id="central" onChange={handleEntidade} value="0" />
                            <label className="form-check-label" htmlFor="central">
                                Central
                            </label>

                        </div>
                    </div>
                </div>
            </div>

            <div className='row table-container'>
                <div className='col-md-12'>

                    <div className="tabs-tarefas">
                        <Tab.Container defaultActiveKey="endereco">
                            <Nav variant="pills">
                                <Nav.Item>
                                    <Nav.Link eventKey="endereco">
                                        Endereço
                                    </Nav.Link>
                                </Nav.Item>

                                <Nav.Item>
                                    <Nav.Link eventKey="tarefas">
                                        Tarefas
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>

                            <Tab.Content>
                                <Tab.Pane eventKey="endereco">

                                    <Title title={"Dados de Endereço"} />
                                    <div className="row">
                                        <div className="col-md-12 no-padding">
                                            <Endereco endereco={endereco} handleChange={handleEndereco} />
                                        </div>
                                    </div>
                                </Tab.Pane>


                                <Tab.Pane eventKey="tarefas">
                                    <Title title={"Dados das tarefas"} />
                                    <div className="row">
                                        <div className="col-md-12 no-padding">
                                            <div className='menu'>
                                                <button className='menu-button button-blue' onClick={() => { HandleModalTarefa(true) }}>
                                                    <i className='fa-solid fa-plus'></i> Adicionar Tarefa
                                                </button>
                                            </div>
                                            <Table columns={columnsTarefa} data={entidade.tarefas} onEdit={ModalEditTarefa} onDelete={DeleteTarefa} />
                                        </div>
                                    </div>
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                    </div>
                </div>
            </div>

            <ModalTarefa Model={modelTarefa} show={showModalTarefa} onHide={() => { HandleModalTarefa(false) }} onAdd={CreateTarefa} onEdit={EditTarefa} />
        </>
    )

}

export default Create;