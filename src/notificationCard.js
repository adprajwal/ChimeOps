const github = require('@actions/github');
const axios = require('axios');

const statusText = (status) => {
  switch (status) {
    case 'success':
      return 'Success';
    case 'failure':
      return 'Failed';
    case 'cancelled':
      return 'Cancelled';
    default:
      throw Error(`Invalid parameter. status=${status}.`);
  }
};

const statusIconUrl = (status) => {
  switch (status) {
    case 'success':
      return 'https://icons.iconarchive.com/icons/custom-icon-design/flatastic-2/256/success-icon.png';
    case 'failure':
      return 'https://icons.iconarchive.com/icons/hopstarter/sleek-xp-basic/256/Close-icon.png';
    case 'cancelled':
      return 'https://icons.iconarchive.com/icons/custom-icon-design/mono-general-1/256/close-icon.png';
    default:
      return 'https://icons.iconarchive.com/icons/pictogrammers/material/256/github-icon.png';
  }
};

const textButton = (text, url) => ({
  textButton: {
    text,
    onClick: { openLink: { url } },
  },
});

const notificationCard = async (name, url, status, customText) => {
  const { owner, repo } = github.context.repo;
  const { eventName, sha, ref, actor } = github.context;
  const actorAvatar = github.context?.payload?.sender?.avatar_url;
  const { number } = github.context.issue;

  const repoUrl = `https://github.com/${owner}/${repo}`;
  const branch = ref.split('/').pop();
  const refUrl = `${repoUrl}/tree/${branch}`;
  const eventPath = eventName === 'pull_request' ? `/pull/${number}` : `/commit/${sha}`;
  const eventUrl = `${repoUrl}${eventPath}`;
  const viewRepo = `${repoUrl}`
  const profileUrl = `https://github.com/${actor}`;

  let commitMsg = '';
  if (eventName === 'push' && github.context.payload.head_commit) {
    commitMsg = github.context.payload.head_commit.message || '';
  }

  const customMessage = customText
    ? `<b>Note:</b> ${customText}`
    : '';

  const body = {
    cards: [
      {
        header: {
          title: name || 'Pipeline Notification',
          subtitle: `Status: ${statusText(status)}`,
          imageUrl: statusIconUrl(status),
          imageStyle: 'IMAGE',
        },
        sections: [
          {
            widgets: [
              {
                keyValue: {
                  topLabel: 'Repository',
                  content: `${owner}/${repo}`,
                  iconUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
                  onClick: {
                    openLink: {
                      url: repoUrl,
                    },
                  },
                },
              },
              {
                keyValue: {
                  topLabel: 'Branch',
                  content: branch,
                  iconUrl: 'https://icons.iconarchive.com/icons/ionic/ionicons/256/git-branch-icon.png',
                  onClick: {
                    openLink: {
                      url: refUrl,
                    },
                  },
                },
              },
              {
                keyValue: {
                  topLabel: 'Event',
                  content: eventName,
                  iconUrl: 'https://icons.iconarchive.com/icons/github/octicons/256/bell-fill-16-icon.png',
                  onClick: {
                    openLink: {
                      url: eventUrl,
                    },
                  },
                },
              },
            ],
          },
          {
            widgets: [
              {
                keyValue: {
                  topLabel: 'Commit Message',
                  content: commitMsg || 'N/A',
                  contentMultiline: true,
                },
              },
              {
                textParagraph: {
                  text: customMessage,
                },
              },
            ],
          },
          {
            widgets: [
              {
                keyValue: {
                  topLabel: 'Triggered by',
                  content: actor,
                  iconUrl: actorAvatar || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
                  onClick: {
                    openLink: {
                      url: profileUrl,
                    },
                  },
                },
              },
              {
                buttons: [
                  textButton('Open Repo', viewRepo),
                  textButton('Check pipeline', `${repoUrl}/actions`),
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  const response = await axios.default.post(url, body);
  if (response.status !== 200) {
    throw new Error(
      `Google Chat notification failed. response status=${response.status}\nResponse message=${response.data}`,
    );
  }
};

module.exports = { notificationCard };
