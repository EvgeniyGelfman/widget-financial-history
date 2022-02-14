@Library('opower.jenkins@master') _

import opower.jenkins.VersionIncrementType

npmJob {
    notifications.channel = 'dss-build-alerts'
    versionIncrementType = VersionIncrementType.MINOR

    hooks.onPublish = { next ->
        next()

        def packageJson = readJSON(file: 'package.json')
        build(job: 'digital-self-service/maestro-widget-library-dss/release%2Flatest', propagate: false, wait: false, parameters: [
            string(name: 'UPDATE_DEPENDENCY', value: packageJson.name)
        ])
    }
}
