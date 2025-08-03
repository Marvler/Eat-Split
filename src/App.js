import {useState} from "react";

const initialFriends = [
    {
        id: 118836,
        name: "Clark",
        image: "https://i.pravatar.cc/48?u=118836",
        balance: -7,
    },
    {
        id: 933372,
        name: "Sarah",
        image: "https://i.pravatar.cc/48?u=933372",
        balance: 20,
    },
    {
        id: 499476,
        name: "Anthony",
        image: "https://i.pravatar.cc/48?u=499476",
        balance: 0,
    },
];

export default function App() {
    const [isFormAddFriendVisible, setIsFormAddFriendVisible] = useState(false);
    const [friends, setFriends] = useState(initialFriends);
    const [friendSelected, setFriendSelected] = useState(null);

    const handleAddFriend = (newFriend) => {
        setFriends(prevFriends => [...prevFriends, newFriend]);
        setIsFormAddFriendVisible(false)
    }

    const handleSelection = (friend) => {
        setFriendSelected(curr =>
            (curr && curr?.id)
            === friend?.id ? null : friend);
    }

    const handleSplitBill = (event, friend, paidByFriend) => {
        event.preventDefault();
        const updatedFriends = friends.filter(f => f.id !== friend.id);
        const updatedFriend = { ...friend, balance: friend.balance + paidByFriend };
        setFriends([...updatedFriends, updatedFriend]);
        setFriendSelected(null);
    };

    return <div className='app'>
        <div className="sidebar">
            <FriendsList friends={friends} handleSelection={handleSelection} friendSelected={friendSelected}/>
            {isFormAddFriendVisible &&
                <FormAddFriend handleAddFriend={handleAddFriend}/>}
            <Button
                handleClick={() => setIsFormAddFriendVisible(prevState => !prevState)}>{isFormAddFriendVisible ? `Close` : `Add friend`}</Button>
        </div>
        {friendSelected && (<FormSplitBill friend={friendSelected} handleSplitBill={handleSplitBill}/>)}
    </div>
}

function FriendsList({friends, handleSelection, friendSelected}) {
    return (
        <ul>
            {friends.map(friend => (
                <Friend key={friend.id} friend={friend} handleSelection={handleSelection}
                        friendSelected={friendSelected}/>
            ))}
        </ul>
    );
}

function Friend({friend, handleSelection, friendSelected}) {
    return (
        <li>
            <img src={friend.image} alt={friend.name}/>
            <h3>{friend.name}</h3>
            {friend.balance < 0 && <p className="red">You owe {friend.name} {Math.abs(friend.balance)} $</p>}
            {friend.balance > 0 && <p className="green">You are owed {friend.name} {Math.abs(friend.balance)} $</p>}
            {friend.balance === 0 && <p>You and {friend.name} are even</p>}

            <Button
                handleClick={() => handleSelection(friend)}>{friendSelected?.id !== friend.id ? "Select" : "Close"}</Button>
        </li>
    );
}

function Button({handleClick, children}) {
    return (
        <button onClick={handleClick} className="button">
            {children}
        </button>
    );
}

function FormAddFriend({handleAddFriend}) {
    const [name, setName] = useState('');
    const [image, setImage] = useState('https://i.pravatar.cc/48');

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!name || !image) return;

        const id = Math.floor(Math.random() * 900000) + 100000;
        const newFriend = {
            id,
            name,
            image: `${image}?u=${id}`,
            balance: 0,
        }


        handleAddFriend(newFriend);
        setName('');
        setImage('https://i.pravatar.cc/48');
    }

    return (
        <form className='form-add-friend' onSubmit={handleSubmit}>
            <label>🙋‍♂️Friend name</label>
            <input type="text" value={name} placeholder="Enter friend's name"
                   onChange={(event) => setName(event.target.value)}/>

            <label>🏖Image URL</label>
            <input value={image} onChange={(event) => setImage(event.target.value)} type="text"
                   placeholder="Enter friend's image URL"/>

            <Button>Add</Button>
        </form>
    );
}

function FormSplitBill({friend, handleSplitBill}) {
    const [bill, setBill] = useState('');
    const [paidByUser, setPaidByUser] = useState('');
    const paidByFriend = bill ? bill - paidByUser : '';
    const [whoIsPaying, setWhoIsPaying] = useState('user');

    return (
        <form className='form-split-bill'>
            <h2>Split a bill with {friend.name}</h2>

            <label>💰Bill value</label>
            <input type="number" placeholder="Bill value" value={bill}
                   onChange={(event) => setBill(event.target.value)}/>

            <label>💸Your expense</label>
            <input type="number" placeholder="Your expense" value={paidByUser}
                   onChange={event => setPaidByUser(event.target.value)}/>

            <label>💁‍♂️{friend.name}'s expense</label>
            <input disabled type="number" placeholder={`${friend.name}'s expense`} value={paidByFriend}/>

            <label>🤑Who is paying the bill?</label>
            <select onChange={(event) => setWhoIsPaying(event.target.value)} value={whoIsPaying}>
                <option value={'user'}>You</option>
                <option value={'friend'}>{friend.name}</option>
            </select>

            <Button handleClick={(event) => handleSplitBill(event, friend, paidByFriend)}>Split Bill</Button>
        </form>
    );
}