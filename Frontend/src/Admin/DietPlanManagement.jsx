import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  ChevronDown,
  Edit,
  Trash,
  AlertCircle,
  Utensils,
  ArrowLeft
} from 'lucide-react';
import './DietPlanManagement.css';

function DietPlanManagement() {
  const [dietPlans, setDietPlans] = useState([
    { id: 1, name: "Weight Loss Plan", category: "Weight Loss", calories: "1800", meals: 5, createdAt: "Apr 15, 2025" },
    { id: 2, name: "Muscle Building", category: "Muscle Gain", calories: "3000", meals: 6, createdAt: "Apr 12, 2025" },
    { id: 3, name: "Keto Diet", category: "Keto", calories: "2200", meals: 4, createdAt: "Mar 30, 2025" },
    { id: 4, name: "Vegan Plan", category: "Vegan", calories: "2000", meals: 5, createdAt: "Mar 25, 2025" },
    { id: 5, name: "Mediterranean Diet", category: "Mediterranean", calories: "2400", meals: 3, createdAt: "Mar 20, 2025" },
    { id: 6, name: "Intermittent Fasting", category: "Weight Loss", calories: "1600", meals: 2, createdAt: "Mar 15, 2025" },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  
  const handleDeleteClick = (plan) => {
    setPlanToDelete(plan);
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = () => {
    if (planToDelete) {
      setDietPlans(dietPlans.filter(plan => plan.id !== planToDelete.id));
      setShowDeleteConfirm(false);
      setPlanToDelete(null);
    }
  };
  
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setPlanToDelete(null);
  };
  
  const filteredDietPlans = dietPlans.filter(plan => 
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Map categories to color classes
  const getCategoryColor = (category) => {
    switch(category) {
      case 'Weight Loss': return 'category-weight-loss';
      case 'Muscle Gain': return 'category-muscle-gain';
      case 'Keto': return 'category-keto';
      case 'Vegan': return 'category-vegan';
      case 'Mediterranean': return 'category-mediterranean';
      default: return 'category-default';
    }
  };
  
  return (
    <div>
      <div className="back-button-container">
              <a href="/AdminPanel" className="back-button">
                <ArrowLeft className="back-icon" />
                <span>Go Back</span>
              </a>
            </div>
      {/* Top Cards */}
      <div className="cards-container">
        <div className="info-card">
          <div className="icon-container blue">
            <Utensils className="icon blue-icon" />
          </div>
          <div>
            <p className="card-label">Total Diet Plans</p>
            <p className="card-value">{dietPlans.length}</p>
          </div>
        </div>
        
        <div className="info-card">
          <div className="icon-container green">
            <Utensils className="icon green-icon" />
          </div>
          <div>
            <p className="card-label">Weight Loss Plans</p>
            <p className="card-value">{dietPlans.filter(p => p.category === 'Weight Loss').length}</p>
          </div>
        </div>
        
        <div className="info-card">
          <div className="icon-container purple">
            <Utensils className="icon purple-icon" />
          </div>
          <div>
            <p className="card-label">Specialty Diets</p>
            <p className="card-value">{dietPlans.filter(p => ['Keto', 'Vegan', 'Mediterranean'].includes(p.category)).length}</p>
          </div>
        </div>
      </div>
      
      {/* Actions Bar */}
      <div className="actions-bar">
        {/* Search */}
        <div className="search-container">
          <div className="search-icon-wrapper">
            <Search className="search-icon" />
          </div>
          <input
            type="text"
            placeholder="Search diet plans..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Filter Button */}
        <button className="filter-button">
          <Filter className="button-icon" />
          <span>Filter</span>
          <ChevronDown className="dropdown-icon" />
        </button>
        
        {/* Add Diet Plan Button */}
        <button className="add-button">
          <Plus className="button-icon" />
          <span>Add Diet Plan</span>
        </button>
      </div>
      
      {/* Diet Plan List */}
      <div className="table-container">
        <div className="table-scroll">
          <table className="diet-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Daily Calories</th>
                <th>Meals Per Day</th>
                <th>Created</th>
                <th className="actions-column">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDietPlans.map((plan) => (
                <tr key={plan.id} className="table-row">
                  <td>
                    <div className="plan-name">{plan.name}</div>
                  </td>
                  <td>
                    <div className={`category-badge ${getCategoryColor(plan.category)}`}>
                      {plan.category}
                    </div>
                  </td>
                  <td className="diet-info">
                    {plan.calories} kcal
                  </td>
                  <td className="diet-info">
                    {plan.meals}
                  </td>
                  <td className="diet-info">
                    {plan.createdAt}
                  </td>
                  <td className="actions-cell">
                    <button className="edit-button">
                      <Edit className="small-icon" />
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteClick(plan)}
                    >
                      <Trash className="small-icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="pagination-container">
          <div className="pagination-mobile">
            <button className="pagination-button">
              Previous
            </button>
            <button className="pagination-button">
              Next
            </button>
          </div>
          <div className="pagination-desktop">
            <div>
              <p className="pagination-text">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredDietPlans.length}</span> of{" "}
                <span className="font-medium">{filteredDietPlans.length}</span> results
              </p>
            </div>
            <div>
              <nav className="pagination-nav" aria-label="Pagination">
                <button className="pagination-arrow-button pagination-prev">
                  <span className="sr-only">Previous</span>
                  <svg className="pagination-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="pagination-page-button">
                  1
                </button>
                <button className="pagination-arrow-button pagination-next">
                  <span className="sr-only">Next</span>
                  <svg className="pagination-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <AlertCircle className="alert-icon" />
              <h3 className="modal-title">Confirm Deletion</h3>
            </div>
            <p className="modal-text">
              Are you sure you want to delete diet plan <span className="font-semibold">{planToDelete?.name}</span>? 
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button 
                className="confirm-delete-button"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DietPlanManagement;