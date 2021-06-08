// import {useEffect, useState} from 'react'

import { Fragment } from 'react';
import Head from 'next/head'
import {MongoClient} from 'mongodb';

import MeetupList from '../components/meetups/MeetupList';

const DUMMY_MEETUP = [
    {
        id: 'm1',
        title: 'A First Meetup',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/I-69_exit_70_MI.jpg/1024px-I-69_exit_70_MI.jpg',
        address: 'Some address 5, 12345 Some City',
        description: 'This is a first meetup'
    }
];

function HomePage(props) {
    // const [loadedMeetups, setLoadedMeetups] = useState([]);

    // useEffect(() => {
    //     //send a http reguest and fetch data
    //     setLoadedMeetups(DUMMY_MEETUP);
    // }, []);

    // return <MeetupList meetups={loadedMeetups} />
    // above makes problems with SEO because at first state is [] so should use getStaticProps()

    return <Fragment>
        <Head>
            <title>React Meetups</title>
            <meta name='description' content="Browse a huge list of highly active React meetups!" />
        </Head>
        <MeetupList meetups={props.meetups} />
    </Fragment>
}

// //run in the server after depolyment
// //run when there is incoming message -> too often
// export async function getServerSideProps(context) {
//     const req = context.req;
//     const res = context.res;

//     //fetch data from an API
//     return {
//         props: {
//             meetups: DUMMY_MEETUP
//         }
//     };
// }

//run in the build process
export async function getStaticProps() {
    //fetch data from an API
    const client = await MongoClient.connect(
        'mongodb+srv://admin:admin@cluster0.cl8uh.mongodb.net/meetups?retryWrites=true&w=majority'
    );
    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const meetups = await meetupsCollection.find().toArray();

    client.close();

    return {
        props: {
            meetups: meetups.map(meetup => ({
                title: meetup.title,
                address: meetup.address,
                image: meetup.image,
                id: meetup._id.toString()
            }))
        },
        //how many second data should be updated
        revalidate: 1
    };
}

export default HomePage;