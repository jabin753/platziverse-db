'use strict'

const agent = {
    id: 1,
    uuid: 'yyy-yyy-yyy',
    name: 'fixture',
    username: 'platzi',
    hostname: 'test-host',
    pid: 0,
    connected: true,
    createdAt: new Date(),
    updatedAt: new Date()
}

const agents = [
    agent,
    extend(agent, {id:2, uuid:'yyy-yyy-yyw'}),
    extend(agent, {id:3, uuid:'yyy-yyy-yyz'})
]

function extend (obj, value) {
    const clone = Object.assign({},obj)
    return Object.assign(clone,value)
}

module.exports = {
    single: agent,
    all: agents,
    connected: agents.filter(a => a.connected),
    platzi: agents.filter(a => a.username === 'platzi'),
    byUuid: id => agents.filter(a => a.uuid === id).shift(),
    byId: id => agents.filter(a => a.id === id).shift()
}