import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Modal } from "react-bootstrap"
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cogoToast from "cogo-toast";
import { getAllUsers, deleteUser } from 'apis';

function Users() {
	const navi = useHistory();
	const [page, setPage] = React.useState(1);
	const [pageSize, setPageSize] = React.useState(10);
	const [users, setUsers] = React.useState([]);
	const [isModalOpen, setIsModalOpen] = React.useState(false);
	const [selectedUser, setSelectedUser] = React.useState(null);
	const [deleting, setDeleting] = React.useState(false);

	const token = useSelector(state => state.token);

	useEffect(() => {
		getUsers();
	}, [])

	const columns = [{
		dataField: '_id',
		text: '#',
		formatter: (cell, row, rowIndex) => (page - 1) * pageSize + rowIndex + 1,
		classes: 'column-number',
		headerClasses: 'column-number',
	},
	{
		dataField: 'fullname',
		text: 'Name',
		sort: true,
	}, {
		dataField: 'email',
		text: 'Email',
		sort: true,
	}, {
		dataField: 'role',
		text: 'Role',
		sort: true,
	}, {
		dataField: '',
		text: 'Actions',
		formatter: (cell, row, rowIndex) => (
			<>
			<Button className="btn-fill btn-warning btn-sm" onClick={() => onEdit(row)}>
				Edit
			</Button>
			<Button className="btn-fill btn-danger ml-2 btn-sm" onClick={() => onDelete(row)}>
				Delete
			</Button>
			</>
		),
		classes: 'align-center',
		headerClasses: 'align-center',
	}];
	const defaultSorted = [{
		dataField: 'fullname',
		order: 'desc',
	}];
	const options = {
		onSizePerPageChange: (sizePerPage, page) => {
			console.log('size change: ', sizePerPage, page);
			setPageSize(sizePerPage);
			setPage(page);
		},
		onPageChange: (page, sizePerPage) => {
			console.log('page change: ', sizePerPage, page);
			setPageSize(sizePerPage);
			setPage(page);
		},
	};

	const getUsers = async () => {
		try {
			const result = await getAllUsers(null, token);
			setUsers(result.users);

		} catch (error) {
			console.log(error.data.message);
			cogoToast.error(error.data.message);
		}
	}

  	const onAdd = () => {
    	navi.push('/user/add');
  	};

  	const onEdit = (user) => {
    	navi.push(`/user/edit/${user._id}`);
  	};

  	const onDelete = (user) => {
		setIsModalOpen(true);
		setSelectedUser(user);
  	}

  	const closeDeleteModal = () => {
		setIsModalOpen(false);
  	}

	const onConfirmDelete = async () => {
		try {

			setDeleting(true);
			await deleteUser(selectedUser._id, token);
			setDeleting(false);

			const _users = [];
			users.forEach(user => {
				if (user._id !== selectedUser._id) {
					_users.push(user);
				}
			});
			setUsers(_users);
			cogoToast.success("Deleted user info successfully.");
			closeDeleteModal();
			navi.push('/users');

		} catch (error) {
			setDeleting(false);
			console.log(error);
			cogoToast.error(error.data.message);
		}
	}
  
	return (
		<div className="animated fadeIn h-100 w-100">
			<Button className="btn-fill btn-success mb-2" onClick={ onAdd }>
				Add
			</Button>
			<BootstrapTable
				bootstrap4
				keyField='_id'
				data={users}
				columns={columns}
				defaultSorted={defaultSorted}
				pagination={ paginationFactory(options) }
				noDataIndication="No user found"
				striped
				hover
			/>

			<Modal show={isModalOpen}>
				<Modal.Body>Are you sure you want to delete the user?</Modal.Body>
				<Modal.Footer>
					<Button type="submit" className="btn-fill btn-danger" onClick={ onConfirmDelete } disabled={deleting}>Delete</Button>{' '}
					<Button className="btn-default" onClick={ closeDeleteModal }>Cancel</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}

export default Users;