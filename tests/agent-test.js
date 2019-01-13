'use strict'

const test = require('ava')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

const agentFixtures = require('./fixtures/agent')

let config = {
  logging: function () {}
}
let db = null
let single = Object.assign({}, agentFixtures.single)
let id = 1
let uuid = 'yyy-yyy-yyy'
let uuidArgs = {
  where: { uuid }
}
let AgentStub = null
let MetricStub = { belongsTo: sinon.spy() }
let sandbox = sinon.createSandbox()

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()

  AgentStub = {
    hasMany: sandbox.spy()
  }

  // Model findById Stub
  AgentStub.findById = sandbox.stub()
  AgentStub.findById.withArgs(id).returns(Promise.resolve(agentFixtures.byId(id)))
  // Model findOne Stub
  AgentStub.findOne = sandbox.stub()
  AgentStub.findOne.withArgs(uuidArgs).returns(Promise.resolve(agentFixtures.byUuid(uuid)))
  // Model update Stub
  AgentStub.update = sandbox.stub()
  AgentStub.update.withArgs(single, uuidArgs).returns(Promise.resolve(single))

  const setupDatabase = proxyquire('../', {
    './models/agent': () => AgentStub,
    './models/metric': () => MetricStub
  })
  db = await setupDatabase(config)
})

test('Agent', t => {
  t.truthy(db.Agent, 'Agent service should exist')
})
test.serial('Setup', t => {
  t.true(AgentStub.hasMany.called, 'AgentStup.hasMany executed')
  t.true(MetricStub.belongsTo.called, 'MetricSub.belongsTo executed')
})

test.serial('Agent#findById', async t => {
  let agent = await db.Agent.findById(id)

  t.true(AgentStub.findById.called, 'Should be called on model')
  t.true(AgentStub.findById.calledOnce, 'Should be called once')
  t.true(AgentStub.findById.calledWith(id), 'Should be called with that specific id')

  t.deepEqual(agent, agentFixtures.byId(id), 'Should be the same')
})

test.serial('Agent#createOrUpdate - exists', async t => {
  let agent = await db.Agent.createOrUpdate(single)

  t.true(AgentStub.findOne.called, 'Should be called on model')
  t.deepEqual(agent, single, 'agent should be the same')
})
test.afterEach(t => {
  sandbox && sandbox.restore()
})
