
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import StarRatings from "react-star-ratings";
import Slider from "rc-slider";
import cogoToast from "cogo-toast";

import { getRestaurants, deleteRestaurant } from "apis";
import "./list.scss";

function Restaurants() {
	const navi = useHistory();
	const [minRate, setMinRate] = React.useState(0);
	const [maxRate, setMaxRate] = React.useState(5);
	const [restaurants, setRestaurants] = React.useState([]);
	const [pageSize, setPageSize] = React.useState(10);
	const [page, setPage] = React.useState(1);
	const [selectedRestaurant, setSelectedRestaurant] = React.useState(null);
	const [isModalOpen, setIsModalOpen] = React.useState(false);
	const [deleting, setDeleting] = React.useState(false);

	const user = useSelector(state => state.user);
	const token = useSelector(state => state.token);

	const columns = [{
		dataField: '_id',
		text: '#',
		formatter: (cell, row, rowIndex) => (page - 1) * pageSize + rowIndex + 1,
		classes: 'column-number',
		headerClasses: 'column-number',
	},
	{
		dataField: 'name',
		text: 'Name',
		sort: true,
	}, {
		dataField: 'owner.fullname',
		text: 'Owner',
		sort: true,
	}, {
		dataField: 'rateAvg',
		text: 'Average rating',
		sort: true,
		formatter: (cell, row, rowIndex) => (cell > 0 ? (
			<StarRatings
				rating={cell}
				starRatedColor="rgb(230, 67, 47)"
				starDimension="20px"
				starSpacing="0px"
			/>
		) : <i>No review</i>),
		classes: 'td-rating',
		headerClasses: 'td-rating',
	}, {
		dataField: '',
		text: 'Actions',
		formatter: (cell, row, rowIndex) => (
			<>
			<Button className="btn-fill btn-primary btn-sm" onClick={() => viewRestaurant(row)}>
				View
			</Button>
			{user.role !== 'regular'
			&& <>
			<Button className="btn-fill btn-warning btn-sm ml-1" onClick={() => onEdit(row)}>
				Edit
			</Button>
			<Button className="btn-fill btn-danger btn-sm ml-1" onClick={() => onDelete(row)}>
				Delete
			</Button>
			</>
			}
			</>
		),
		align: 'center',
		headerAlign: 'center',
	}];

	const defaultSorted = [{
		dataField: 'rateAvg',
		order: 'desc',
	}];

	const options = {
		onSizePerPageChange: (sizePerPage, page) => {
			setPageSize(sizePerPage);
			setPage(page);
		},
		onPageChange: (page, sizePerPage) => {
			setPageSize(sizePerPage);
			setPage(page);
		},
	};

	useEffect(() => {
		getAllRestaurants(minRate, maxRate);
	}, [])

	const getAllRestaurants = async (min, max) => {
		try {
			const result = await getRestaurants(min, max, token);
			setRestaurants(result.restaurants);

		} catch (error) {
			console.log(error)
			cogoToast.error(error.data.message);
		}
	}
	
	const onFilterValueChange = (values) => {
		setMinRate(values[0]);
		setMaxRate(values[1]);

		getAllRestaurants(values[0], values[1]);
	}

	const onAdd = () => {
		navi.push('/restaurant/add');
	}

	const viewRestaurant = (restaurant) => {
		navi.push(`/restaurant/detail/${restaurant._id}`);
	}

	const onEdit = (restaurant) => {
		navi.push(`/restaurant/edit/${restaurant._id}`);
	}

	const onDelete = (restaurant) => {
		setIsModalOpen(true);
		setSelectedRestaurant(restaurant);
	}

	const closeDeleteModal = () => {
		setIsModalOpen(false);
	}

	const onConfirmDelete = async () => {

		try {
			setDeleting(true);
			await deleteRestaurant(selectedRestaurant._id, token);

			let _restaurants = [];
			restaurants.forEach(restaurant => {
				if (restaurant._id !== selectedRestaurant._id) {
					_restaurants.push(restaurant);
				}
			});

			setRestaurants(_restaurants);
			closeDeleteModal();
			cogoToast.success("Delete restaurant successfully.");

		} catch (error) {
			console.log(error);
			cogoToast.error(error.data.message);

		} finally {
			setDeleting(false);
		}
	}

	return (
		<div className="animated fadeIn h-100 w-100" id="restaurant-list">
			<div className="d-flex align-items-center justify-content-between mb-2">
			{ ['admin', 'owner'].indexOf(user.role) >= 0
				? <Button className="btn-fill btn-success" onClick={ onAdd }>
					Add
				</Button>
				: <div />
			}
				<div className="filter d-flex align-items-center justify-content-between">
					<div className="mr-3">Filter by rate: </div>
					<div className="d-flex align-items-center justify-content-between flex-grow-1">
						<span className="mr-3">{ minRate }</span>
						<Slider.Range
							min={0}
							max={5}
							step={0.5}
							defaultValue={[0, 5]}
							railStyle={{ backgroundColor: 'grey' }}
							trackStyle={[{ backgroundColor: 'red' }, { backgroundColor: 'green' }]}
							onAfterChange={onFilterValueChange} />
						<span className="ml-3">{ maxRate }</span>
					</div>
				</div>
			</div>
			<BootstrapTable
				bootstrap4
				keyField='_id'
				data={restaurants}
				columns={columns}
				defaultSorted={defaultSorted}
				pagination={ paginationFactory(options) }
				noDataIndication="No result found"
				striped
				hover
			/>

			<Modal show={isModalOpen}>
				<Modal.Body>Are you sure you want to delete the restaurant?</Modal.Body>
				<Modal.Footer>
					<Button type="submit" className="btn-fill btn-danger" onClick={ onConfirmDelete } disabled={deleting}>Delete</Button>{' '}
					<Button className="btn-default" onClick={ closeDeleteModal }>Cancel</Button>
				</Modal.Footer>
			</Modal>
		</div>
	)
}

export default Restaurants;