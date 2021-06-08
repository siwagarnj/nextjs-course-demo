import { Fragment } from 'react';
import Head from 'next/head'
import {MongoClient, ObjectId} from 'mongodb';

import MeetupDetail from '../../components/meetups/MeetupDetail'

function MeetupDetails(props) {
    return (
    <Fragment>
        <Head>
            <title>{props.meetupData.title}</title>
            <meta name='description' content={props.meetupData.description} />
        </Head>
        <MeetupDetail
            image = {props.meetupData.image}
            title = {props.meetupData.title}
            address = {props.meetupData.address}
            description = {props.meetupData.description}
        />
    </Fragment>
    
    );
}

export async function getStaticPaths() {

    const client = await MongoClient.connect(
        'mongodb+srv://admin:admin@cluster0.cl8uh.mongodb.net/meetups?retryWrites=true&w=majority'
    );
    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const meetups = await meetupsCollection.find({},{_id: 1}).toArray();

    client.close();

    return {
        fallback: false, //paths contain ALL supported value
        paths: meetups.map((meetup) => ({
            params: { meetupId: meetup._id.toString() }
        })) 
    };
}

export async function getStaticProps(context) {
    //fetch data for a single meetup

    const meetupId = context.params.meetupId;

    const client = await MongoClient.connect(
        'mongodb+srv://admin:admin@cluster0.cl8uh.mongodb.net/meetups?retryWrites=true&w=majority'
    );
    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const selectedMeetup = await meetupsCollection.findOne({
        _id: ObjectId(meetupId)
    });

    console.log(selectedMeetup);

    client.close();

    return {
        props: {
            meetupData: {
                id: selectedMeetup._id.toString(),
                title: selectedMeetup.title,
                address: selectedMeetup.address,
                image: selectedMeetup.image,
                description: selectedMeetup.description
            }
        }
    };
}

export default MeetupDetails;