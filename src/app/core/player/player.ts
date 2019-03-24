import {Injectable} from '@angular/core';
import {SearchResponse} from '../../search/model/search-response';
import {MediaResponse} from '../../search/model/media-response';
import {MediaRequest} from '../../search/model/media-request';
import {PeerConnection} from '../model/peer-connection';
import {Base64} from '../base64';
import deepEqual = require('deep-equal');

@Injectable()
export class Player {
    public mediaRequest: MediaRequest;
    public mediaResponse: MediaResponse;

    private peer: PeerConnection;
    private audioElm: HTMLAudioElement = document.createElement('audio');

    // TODO:
    //  implement it
    private playing: boolean;

    constructor() {
        this.audioElm.preload = 'auto';
        this.audioElm.autoplay = true;
    }

    // TODO:
    //  implement
    public play(): void {
        this.playing = true;
    }

    // TODO:
    //  implement
    public stop(): void {
        this.playing = false;
    }

    public isWaitingForResponse(): boolean {
        return this.peer != null && this.mediaRequest != null && this.mediaResponse == null;
    }

    public isPlaying(): boolean {
        return this.playing;
    }

    public setMediaRequest(peer: PeerConnection, request: MediaRequest): void {
        const self = this;
        const pc = peer.connection;

        self.dropPeer(this.peer);

        pc.ontrack = ((event: RTCTrackEvent) => {
            console.log('Peer connection: track received');
            self.audioElm.srcObject = event.streams[0];

            // const el = document.createElement(event.track.kind) as HTMLAudioElement;
            // el.srcObject = event.streams[0];
            // el.preload = 'auto';
            // el.autoplay = true;
            // el.controls = true;
            //
            // document.getElementById('remoteVideos').appendChild(el);
        });

        pc.oniceconnectionstatechange = ((e) => {
            if (pc.iceConnectionState === 'completed'
                || pc.iceConnectionState === 'disconnected'
                || pc.iceConnectionState === 'failed'
                || pc.iceConnectionState === 'closed') {
                self.dropPeer(peer);
            }
            console.log('Peer connection: state changed: ' + pc.iceConnectionState);
        });

        self.peer = peer;
        self.mediaRequest = request;
    }

    public setMediaResponse(response: MediaResponse): boolean {
        const self = this;

        if (!self.peer
            || !self.mediaRequest
            || !response
            || response.request.owner.username !== self.mediaRequest.owner.username
            || response.request.media.coreSideID !== self.mediaRequest.media.coreSideID
            || response.request.media.rootID !== self.mediaRequest.media.rootID) {
            console.log('Player: invalid media response set: ' + JSON.stringify(response));
            return false;
        }

        try {
            self.peer.connection.setRemoteDescription(new RTCSessionDescription(JSON.parse(Base64.Decode(response.webRTCKey))));
        } catch (e) {
            console.log('Peer connection: remote description set failed: ' + e.toString());
            self.dropPeer();
        }

        self.mediaResponse = response;

        return true;
    }

    public dropPeer(peer?: PeerConnection): void {
        this.stop();

        if (peer) {
            peer.connection.close();
        } else if (this.peer) {
            this.peer.connection.close();
        }

        if (!peer || deepEqual(peer, this.peer)) {
            this.peer = null;
            this.mediaRequest = null;
            this.mediaResponse = null;
        }
    }

    public isCurrentMediaEquals(searchResponse: SearchResponse): boolean {
        return this.mediaRequest
            && searchResponse
            && searchResponse.owner.username === this.mediaRequest.owner.username
            && searchResponse.media.coreSideID === this.mediaRequest.media.coreSideID
            && searchResponse.media.rootID === this.mediaRequest.media.rootID;
    }
}
