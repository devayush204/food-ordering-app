import { db } from "@/models/fireBase_connect";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";

// Function to check if the user is an admin
const isAdmin = async (userId) => {
    try {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            return userData.isAdmin || false;
        } else {
            console.log('No such document!');
            return false;
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        return false;
    }
};

export async function POST(req) {
    const { name, userId } = await req.json();
    if (await isAdmin(userId)) {
        const userDocRef = doc(db, 'users', userId);
        const categoriesCollectionRef = collection(userDocRef, 'categories');
        const categoryDoc = await addDoc(categoriesCollectionRef, { name });
        return Response.json(categoryDoc);
    } else {
        return Response.json({ error: "User is not an admin" });
    }
}

export async function PUT(req) {
    const { userId, categoryId, name } = await req.json();
    if (await isAdmin(userId)) {
        const userDocRef = doc(db, 'users', userId);
        const categoryDocRef = doc(collection(userDocRef, 'categories'), categoryId);
        await setDoc(categoryDocRef, { name }, { merge: true });
        return Response.json(true);
    } else {
        return Response.json({ error: "User is not an admin" });
    }
}

export async function GET(req) {
    const { userId } = await req.json();
    if (await isAdmin(userId)) {
        const userDocRef = doc(db, 'users', userId);
        const categoriesCollectionRef = collection(userDocRef, 'categories');
        const categoriesSnapshot = await getDocs(categoriesCollectionRef);
        const categories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return Response.json(categories);
    } else {
        return Response.json({ error: "User is not an admin" });
    }
}

export async function DELETE(req) {
    const { userId, categoryId } = await req.json();
    if (await isAdmin(userId)) {
        const userDocRef = doc(db, 'users', userId);
        const categoryDocRef = doc(collection(userDocRef, 'categories'), categoryId);
        await deleteDoc(categoryDocRef);
        return Response.json(true);
    } else {
        return Response.json({ error: "User is not an admin" });
    }
}