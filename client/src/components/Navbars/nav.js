const getNavigationItems = (role) => {
	const navItems = [{
		name: 'Restaurants',
		url: '/restaurants',
		icon: 'nc-icon nc-paper-2'		
	}];
	
	if (role === 'admin') {
		navItems.push({
			name: 'Users',
			url: '/users',
			icon: 'nc-icon nc-single-02'
		});
	} else if (role === 'owner') {
		navItems.push({
			name: 'Pending Reviews',
			url: '/reviews-pending',
			icon: 'nc-icon nc-satisfied'
		});
	}
	navItems.push({
		name: 'Profile',
		url: '/profile',
		icon: 'nc-icon nc-circle-09'
	});
	navItems.push({
		name: 'Password',
		url: '/password',
		icon: 'nc-icon nc-settings-gear-64'
	});

	return {
		items: navItems,
	};
};
  
export default getNavigationItems