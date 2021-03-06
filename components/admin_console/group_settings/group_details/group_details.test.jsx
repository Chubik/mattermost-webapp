// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {shallow} from 'enzyme';

import GroupDetails from 'components/admin_console/group_settings/group_details/group_details.jsx';

describe('components/admin_console/group_settings/group_details/GroupDetails', () => {
    const defaultProps = {
        groupID: 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
        group: {
            display_name: 'Group',
        },
        groupTeams: [
            {team_id: '11111111111111111111111111'},
            {team_id: '22222222222222222222222222'},
            {team_id: '33333333333333333333333333'},
        ],
        groupChannels: [
            {channel_id: '44444444444444444444444444'},
            {channel_id: '55555555555555555555555555'},
            {channel_id: '66666666666666666666666666'},
        ],
        members: [
            {id: '77777777777777777777777777'},
            {id: '88888888888888888888888888'},
            {id: '99999999999999999999999999'},
        ],
        memberCount: 20,
        actions: {
            getGroup: jest.fn().mockReturnValue(Promise.resolve()),
            getMembers: jest.fn().mockReturnValue(Promise.resolve()),
            getGroupSyncables: jest.fn().mockReturnValue(Promise.resolve()),
            link: jest.fn(),
            unlink: jest.fn(),
        },
    };

    test('should match snapshot, with everything closed', () => {
        const wrapper = shallow(<GroupDetails {...defaultProps}/>);
        defaultProps.actions.getGroupSyncables.mockClear();
        expect(wrapper).toMatchSnapshot();
    });

    test('should match snapshot, with add team or channel buttom drop down open', () => {
        const wrapper = shallow(<GroupDetails {...defaultProps}/>);
        wrapper.setState({addTeamOrChannelOpen: true});
        defaultProps.actions.getGroupSyncables.mockClear();
        expect(wrapper).toMatchSnapshot();
    });

    test('should match snapshot, with add team selector open', () => {
        const wrapper = shallow(<GroupDetails {...defaultProps}/>);
        wrapper.setState({addTeamOpen: true});
        defaultProps.actions.getGroupSyncables.mockClear();
        expect(wrapper).toMatchSnapshot();
    });

    test('should match snapshot, with add channel selector open', () => {
        const wrapper = shallow(<GroupDetails {...defaultProps}/>);
        wrapper.setState({addChannelOpen: true});
        defaultProps.actions.getGroupSyncables.mockClear();
        expect(wrapper).toMatchSnapshot();
    });

    test('should match snapshot, with loaded state', () => {
        const wrapper = shallow(<GroupDetails {...defaultProps}/>);
        wrapper.setState({loading: false, loadingTeamsAndChannels: false});
        defaultProps.actions.getGroupSyncables.mockClear();
        expect(wrapper).toMatchSnapshot();
    });

    test('should load data on mount', () => {
        const actions = {
            getGroupSyncables: jest.fn().mockReturnValue(Promise.resolve()),
            getGroup: jest.fn().mockReturnValue(Promise.resolve()),
            getMembers: jest.fn(),
            link: jest.fn(),
            unlink: jest.fn(),
        };
        shallow(
            <GroupDetails
                {...defaultProps}
                actions={actions}
            />
        );
        expect(actions.getGroupSyncables).toBeCalledWith('xxxxxxxxxxxxxxxxxxxxxxxxxx', 'team');
        expect(actions.getGroupSyncables).toBeCalledWith('xxxxxxxxxxxxxxxxxxxxxxxxxx', 'channel');
        expect(actions.getGroupSyncables).toBeCalledTimes(2);
        expect(actions.getGroup).toBeCalledWith('xxxxxxxxxxxxxxxxxxxxxxxxxx');
    });

    test('should open/close properly the channel and team selectors', () => {
        const wrapper = shallow(<GroupDetails {...defaultProps}/>);
        const instance = wrapper.instance();
        instance.toggleAddTeamOrChannel();
        expect(wrapper.state().addTeamOpen).toBe(false);
        expect(wrapper.state().addChannelOpen).toBe(false);
        expect(wrapper.state().addTeamOrChannelOpen).toBe(true);
        instance.openAddChannel();
        expect(wrapper.state().addTeamOpen).toBe(false);
        expect(wrapper.state().addChannelOpen).toBe(true);
        expect(wrapper.state().addTeamOrChannelOpen).toBe(false);
        instance.closeAddChannel();
        expect(wrapper.state().addTeamOpen).toBe(false);
        expect(wrapper.state().addChannelOpen).toBe(false);
        expect(wrapper.state().addTeamOrChannelOpen).toBe(false);
        instance.toggleAddTeamOrChannel();
        instance.openAddTeam();
        expect(wrapper.state().addTeamOpen).toBe(true);
        expect(wrapper.state().addChannelOpen).toBe(false);
        expect(wrapper.state().addTeamOrChannelOpen).toBe(false);
        instance.closeAddTeam();
        expect(wrapper.state().addTeamOpen).toBe(false);
        expect(wrapper.state().addChannelOpen).toBe(false);
        expect(wrapper.state().addTeamOrChannelOpen).toBe(false);
        instance.toggleAddTeamOrChannel();
        expect(wrapper.state().addTeamOrChannelOpen).toBe(true);
        instance.toggleAddTeamOrChannel();
        expect(wrapper.state().addTeamOrChannelOpen).toBe(false);
    });

    test('should call link for each channel when addChannels is called', async () => {
        const actions = {
            getGroupSyncables: jest.fn().mockReturnValue(Promise.resolve()),
            getGroup: jest.fn().mockReturnValue(Promise.resolve()),
            getMembers: jest.fn(),
            link: jest.fn().mockReturnValue(Promise.resolve()),
            unlink: jest.fn().mockReturnValue(Promise.resolve()),
        };
        const wrapper = shallow(
            <GroupDetails
                {...defaultProps}
                actions={actions}
            />
        );
        const instance = wrapper.instance();
        await instance.addChannels([{id: '11111111111111111111111111'}, {id: '22222222222222222222222222'}]);
        expect(actions.getGroupSyncables).toBeCalledWith('xxxxxxxxxxxxxxxxxxxxxxxxxx', 'channel');
        expect(actions.getGroupSyncables).toBeCalledTimes(3);
        expect(actions.link).toBeCalledWith('xxxxxxxxxxxxxxxxxxxxxxxxxx', '11111111111111111111111111', 'channel', {can_leave: true, auto_add: true});
        expect(actions.link).toBeCalledWith('xxxxxxxxxxxxxxxxxxxxxxxxxx', '22222222222222222222222222', 'channel', {can_leave: true, auto_add: true});
        expect(actions.link).toBeCalledTimes(2);
    });

    test('should call link for each team when addTeams is called', async () => {
        const actions = {
            getGroupSyncables: jest.fn().mockReturnValue(Promise.resolve()),
            getGroup: jest.fn().mockReturnValue(Promise.resolve()),
            getMembers: jest.fn(),
            link: jest.fn().mockReturnValue(Promise.resolve()),
            unlink: jest.fn().mockReturnValue(Promise.resolve()),
        };
        const wrapper = shallow(
            <GroupDetails
                {...defaultProps}
                actions={actions}
            />
        );
        const instance = wrapper.instance();
        await instance.addTeams([{id: '11111111111111111111111111'}, {id: '22222222222222222222222222'}]);
        expect(actions.getGroupSyncables).toBeCalledWith('xxxxxxxxxxxxxxxxxxxxxxxxxx', 'team');
        expect(actions.getGroupSyncables).toBeCalledTimes(3);
        expect(actions.link).toBeCalledWith('xxxxxxxxxxxxxxxxxxxxxxxxxx', '11111111111111111111111111', 'team', {can_leave: true, auto_add: true});
        expect(actions.link).toBeCalledWith('xxxxxxxxxxxxxxxxxxxxxxxxxx', '22222222222222222222222222', 'team', {can_leave: true, auto_add: true});
        expect(actions.link).toBeCalledTimes(2);
    });
});
