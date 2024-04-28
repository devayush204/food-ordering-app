"use client"
import UserTabs from '@/components/layout/UserTabs'
import { Auth, db } from '@/models/fireBase_connect';
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const CategoriesPage = () => {
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);


  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
        // Listen for changes in authentication state
        const unsubscribe = onAuthStateChanged(Auth, async (user) => {
            if (user) {
                // Fetch categories from Firestore for the authenticated user
                const userId = user.uid;
                const userDocRef = doc(db, 'users', userId);
                const categoriesCollectionRef = collection(userDocRef, 'categories');
                const categoriesSnapshot = await getDocs(categoriesCollectionRef);

                // Extract categories from the snapshot
                const categoriesData = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Update state with fetched categories
                setCategories(categoriesData);
            } else {
                // User is signed out, handle accordingly
                console.error('User is not authenticated');
            }
        });

        // Return unsubscribe function
        return unsubscribe;
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};


  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
        // Get the authenticated user
        const currentUser = Auth.currentUser;
        if (!currentUser) {
            // Handle case where user is not authenticated
            console.error('User is not authenticated');
            return;
        }

        // Add category to Firestore under the authenticated user's document
        const userId = currentUser.uid; // Get the user ID
        const userDocRef = doc(db, 'users', userId);
        const categoriesCollectionRef = collection(userDocRef, 'categories');
        await addDoc(categoriesCollectionRef, { name: categoryName });

        // Reset the category name input field
        setCategoryName('');

        // Show success message
        toast.success('Category created successfully');
    } catch (error) {
        console.error('Error creating category:', error);
        toast.error('Error creating category. Please try again.');
    }
};

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setCategoryName('');
  };


  const handleUpdateCategory = async () => {
    try {
      const usersCollectionRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollectionRef);
      usersSnapshot.forEach(async (userDoc) => {
        const categoryDocRef = doc(userDoc.ref, 'categories', editingCategory.id);
        await updateDoc(categoryDocRef, { name: categoryName });
      });

      setEditingCategory(null);
      setCategoryName('');
      toast.success('Category updated successfully');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Error updating category. Please try again.');
    }
  };

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTabs isAdmin={true} />
      <form className="mt-8">
        <div className="flex gap-2 items-end">
          <div className="grow">
          <label>{editingCategory ? 'Update category name ' : 'New category name'}</label>
            <input
            className='outline-none'
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
          <div className="pb-2 flex gap-2">
            {editingCategory ? (
              <>
                <button
                  className="border border-primary"
                  type="button"
                  onClick={handleUpdateCategory}
                >
                  Update
                </button>
                <button
                  className="border border-primary"
                  type="button"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="border border-primary"
                onClick={handleCategorySubmit}
              >
                Create
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">Categories</h2>
        <ul className="space-y-1">
          {categories.map((category) => (
            <li
              key={category.id}
              className="w-full bg-zinc-100 border capitalize py-2 px-5 rounded-lg cursor-pointer"
              onClick={() => handleEditCategory(category)}
            >
              {category.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default CategoriesPage