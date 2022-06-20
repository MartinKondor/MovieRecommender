<p align="center">
    <img src="docs/img/readme2.gif" width="700">
</p>

# 🎬 MovieRecommender

[![Project Status](https://img.shields.io/badge/status-active-brightgreen.svg)](https://github.com/MartinKondor/MovieRecommender/)
[![version](https://img.shields.io/badge/version-2022.06-brightgreen.svg)](https://github.com/MartinKondor/MovieRecommender)
[![GitHub Issues](https://img.shields.io/github/issues/MartinKondor/MovieRecommender.svg)](https://github.com/MartinKondor/MovieRecommender/issues)
![Contributions welcome](https://img.shields.io/badge/contributions-welcome-blue.svg)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Movie recommender AI. Trained on the [MovieLens](https://grouplens.org/datasets/movielens/) dataset.

[https://martinkondor.github.io/MovieRecommender/](https://martinkondor.github.io/MovieRecommender/)

## Getting Started

### Prerequisites

* Python 3.6+
* Anaconda 4+ (optional)
* Python modules from the `requirements.txt`

### Deployment

Dowload and install the dependencies with the command:

```
$ python -m pip install -r requirements.txt
```

### Usage

__You can try it online: [https://martinkondor.github.io/MovieRecommender/](https://martinkondor.github.io/MovieRecommender/).__

__Or You have to run the python file, and give the liked movie's title as an argument:__
```
$ python rmovie.py "MOVIE TITLE"
```

You can also specify the year in which the movie was released, in this case, you have to put the year in brackets in the same first argument:
```
$ python rmovie.py "MOVIE TITLE (YEAR)"
```

<p align="center">
    <img src="docs/img/readme.gif" width="700">
</p>

* Works with any case (lower or upper)
* The word "the" is always ignored
* You can put the year of the movie inside brackets like: (2020)

Valid request examples:

```
$ python rmovie.py "Shawshank Redemption"
$ python rmovie.py "lord of the rings"
$ python rmovie.py "STAR WARS"
$ python rmovie.py "STAR WARS (1977)"
$ python rmovie.py "tOy StOrY"
```

## Contributing

This project is open for any kind of contribution from anyone.

### Steps

1. Fork this repository
2. Create a new branch (optional)
3. Clone it
4. Make your changes
5. Upload them
6. Make a pull request here

## Authors

* **[Martin Kondor](https://github.com/MartinKondor)**

<p align="center">
<a title="Fiverr" href="https://www.fiverr.com/martinkondor">
<img id="fiverr-img" class="img-responsive" alt="Hire me on fiverr!" title="Hire me on fiverr!" src="https://martinkondor.github.io/img/hire_me_on_fiverr_button.png" width="222">
</a>
</p>

# License

Copyright (C) 2022 Martin Kondor.

See the [LICENSE](LICENSE) file for details.
