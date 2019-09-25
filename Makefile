########################################################
version-major:
	@yarn run release -- --release-as major
	@git push --follow-tags origin master

version-minor:
	@yarn run release -- --release-as minor
	@git push --follow-tags origin master

version-release:
	@yarn run release -- --release
	@git push --follow-tags origin master